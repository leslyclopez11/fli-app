const express = require('express');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const User = require('./RegisterUser');


const app = express();
const PORT = 4000;

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

// cookie parser middleware
app.use(cookieParser());

//username and password
// const myusername = 'user1'
// const mypassword = 'mypassword'


//connect?
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');
// a variable to save a session
var session;

app.get('/test', (req,res) => {
    console.log("in endpoint");
    session=req.session;
    console.log(session);
    if(session.userid){
        res.send("Welcome "+session.userid +"  <a href=\'/logout'>click to logout</a>");
    }else
    res.sendFile('views/index.html',{root:__dirname})
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username: username, password: password })
        .then(user => {
            if (!user) {
                res.send('Invalid username or password');
            } else {
                session = req.session;
                session.userid = user.username;
                res.redirect('/profile'); // Redirect to the profile page upon successful login
            }
        })
        .catch(err => {
            console.log(err);
            res.send('Error occurred');
        });
});

app.post('/register', (req, res) => {
    const { newUsername, newPassword, name, pronouns, classyear, programs } = req.body;
    const newUser = new User({
        username: newUsername,
        password: newPassword,
        name,
        pronouns,
        classyear,
    });
    newUser.save()
    .then((p) => {
        res.send('Succesfully registered');
    })
    .catch((err) => {
        console.log(err);
        res.send('Error');
    })
    

});

app.get('/getProfile', (req, res) => {
    if (!req.session.userid) {
        return res.status(401).send('Unauthorized');
    }

    User.findOne({ username: req.session.userid })
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found');
            }
            res.json({
                username: user.username,
                name: user.name,
                pronouns: user.pronouns,
                classyear: user.classyear
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error occurred');
        });
});

app.post('/updateProfile', (req, res) => {
    if (!req.session.userid) {
        return res.status(401).send('Unauthorized');
    }

    const { name, pronouns, classyear } = req.body;

    User.findOneAndUpdate(
        { username: req.session.userid },
        { name, pronouns, classyear },
        { new: true }
    )
    .then(user => {
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.redirect('/profile'); // Redirect to the profile page or send a success message
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('Error occurred');
    });
});

app.get('/profile', (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/');
    }
    res.sendFile('/profile.html', { root: __dirname });
});

app.post('/updatePassword', (req, res) => {
    if (!req.session.userid) {
        return res.status(401).send('Unauthorized');
    }

    const { username, currentPassword, newPassword } = req.body;

    User.findOne({ username: username, password: currentPassword })
        .then(user => {
            if (!user) {
                return res.status(400).send('Current password is incorrect');
            }

            User.findOneAndUpdate(
                { username: username },
                { password: newPassword },
                { new: true }
            )
            .then(() => {
                res.redirect('/profile'); // Redirect to profile page or send a success message
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('Error occurred');
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error occurred');
        });
});


app.get('/logout', (req,res) => {
    req.session.destroy();
    res.redirect('/');
});



app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));