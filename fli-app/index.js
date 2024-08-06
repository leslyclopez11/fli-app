// set up Express
var express = require('express');
var app = express();
var path = require('path');

// set up BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// set up EJS
app.set('view engine', 'ejs');

// import the Program class from Program.js
var Program = require('./Program.js');

app.use(express.static(path.join(__dirname, 'fli-app')));

var editCount = 1;

app.use('/register', (req,res) => {
    //http://localhost:3010/register?name=Crystal&pronouns=she/her&username=csecair1&password=hello&classyear=2025&programs=HELLO&programs=ANOTHERONE
    var userName = req.query.name;
    var userPronouns = req.query.pronouns; 
    var userUsername = req.query.username; 
    var userPassword = req.query.password; 
    var userClassYear = req.query.classyear;
    var userPrograms = req.query.programs;
	console.log(userPrograms);
    var userProgramsArr = []; 
    if (userName && userPronouns && userUsername && userPassword && userClassYear) {
        if (Array.isArray(userPrograms)) {
            for (let i = 0; i < userPrograms.length; i++) {
                userProgramsArr.push(userPrograms[i]);
            }
        }
        else {
            userProgramsArr.push(userPrograms); 
        }
        /* adding making a new user profile here (after everything is validated) */
        var newProfile = new Profile ({
            name: userName,
            username: userUsername,  
            password: userPassword,
            pronouns: userPronouns,
            classyear: userClassYear,
            programs: userProgramsArr,
        });
            //WHEN IT IS AN ARRAY: programs: req.query.program
            //WHEN IT IS NOT: put it in an array (refer to hw 5) 
        newProfile.save() 
            .then((p) => {
                console.log('a new profile was registered!'); 
                console.log(p);
                res.json({"status": "Successfully registered profile"});
                //res.json({'name': userName, 'pronouns': userPronouns, 'username': userUsername, 'password': userPassword, 'class year': userClassYear, 'programs': userProgramsArr});
            }) 
            .catch((err) => { 
                //res.type('html').status(200); 
                console.log('failed to register new profile' + err);
                res.json({"status": "Failed to register profile"});
                //console.log(err); 
            }) 
    }
}) 

//endpoint that returns all profiles 
app.use('/getProfiles', (req, res) => {
	Profile.find({})
		.then((profiles) => {
			res.json(profiles); 
		})
		.catch((err) => {
			res.type('html').status(200);
		    console.log('uh oh: ' + err);
		    res.send(err);
		})
})

// endpoint that returns all programs 
app.use('/getPrograms', (req, res) => {
	Program.find({})
		.then((programs) => {
			res.json(programs);
			//res.json(programs.name);
			//res.json(programs);
		})
		.catch((err) => {
			res.type('html').status(200);
		    console.log('uh oh: ' + err);
		    res.send(err);
		})
})


// endpoint that returns all programs 
app.use('/getAll', (req, res) => {
	var everyProgram = []; 
	programs.forEach( (program) => {
		everyProgram.push(program); 
	})
	res.json(everyProgram);
})

//endpoint that returns json programs 
app.use('/getAllPrograms', (req, res) => {
	Program.find({})
		.then((programs) => {
			res.json(programs);
		})
		.catch((err) => {
			res.type('html').status(200);
		    console.log('uh oh: ' + err);
		    res.send(err);
		})
})

// endpoint for listing all programs
app.use('/all', (req, res) => {
	Program.find({})
		.then((programs) => {
			res.render('allprograms', {'programs' : programs})
		})
		.catch((err) => {
			res.type('html').status(200);
		    console.log('uh oh: ' + err);
		    res.send(err);
		})
})

// endpoint for creating a new program
// this is the action of the "create new program" form
app.use('/create', (req, res) => {
	// construct the Program from the form data which is in the request BODY
	var newProgram = new Program ({
		name: req.body.name,
		link: req.body.link,
		category: req.body.category,
		location: req.body.location,
		documentedStatus: req.body.documentedStatus,
		deadline: req.body.deadline,
		applicableYear: req.body.applicableYear,
		programDates: req.body.programDates,
		gpaReq: req.body.gpaReq,
		alumniEmail: req.body.alumniEmail
	    });

	// write it to the database
	newProgram.save()
		.then((p) => { 
			console.log('successfully added ' + p.name + ' to the database'); 
			// use EJS to render the page that will be displayed
			res.render('newprogram', {'program': p})
		} )
		.catch((err) => { 
			res.type('html').status(200);
		    console.log('uh oh: ' + err);
		    res.send(err);
		})
	});


/* the two endpoints below here are for editing a program */

app.use('/categorySelect', (req, res) => {
	var categoryChoice = req.query.categorySelect;
	if (categoryChoice == "all") {
		Program.find({})
		.then((programs) => {
			res.render('allprograms', {'programs' : programs})
		})
		.catch((err) => {
			res.type('html').status(200);
		    console.log('uh oh: ' + err);
		    res.send(err);
		})
	}
	else{
		Program.find({category: categoryChoice})
		.then((programs) => {
			res.render('allprograms', {'programs' : programs})
		})
		.catch((err) => {
			res.type('html').status(200);
		    console.log('uh oh: ' + err);
		    res.send(err);
		})
	}
})


// this one shows the HTML form for editing the program
app.use('/showEditForm', (req, res) => {
	var filter = { 'name' : req.query.name };
	// do a query to get the info for this program
	Program.findOne(filter)
	.then((p) => {
		// then show the form from the EJS template
		res.render('editform', {'program' : p})
	})
	.catch((err) => {
		res.type('html').status(200);
		console.log('uh oh: ' + err);
		res.send(err);
	})
})

// this endpoint is called when the user SUBMITS the form to edit a program
app.use('/edit', (req, res) => {
	// get the name and age from the BODY of the request
	var filter = { 'name' : req.body.name };
	var update = {'link' : req.body.link, 'category' : req.body.category, 'location' : req.body.location, 'documentedStatus' : req.body.documentedStatus, 'deadline' : req.body.deadline, 'applicableYear' : req.body.applicableYear, 'programDates' : req.body.programDates, 'gpaReq' : req.body.gpaReq, 'alumniEmail' : req.body.alumniEmail}

	// now update the program in the database
	Program.findOneAndUpdate(filter, update)
	.then((orig) => { // 'orig' refers to the original object before we updated it
		res.render('editedprogram', {'name' : req.body.name, 'link' : req.body.link, 'category' : req.body.category, 
		'location' : req.body.location, 'documentedStatus' : req.body.documentedStatus,'deadline' : req.body.deadline, 'applicableYear' : req.body.applicableYear, 'programDates' : req.body.programDates,
	        'gpaReq' : req.body.gpaReq, 'alumniEmail' : req.body.alumniEmail})
	})
	.catch((err) => {
		res.type('html').status(200);
		console.log('uh oh: ' + err);
		res.send(err);
	})

})

/* These are endpoints for your group to implement in Part 4 of the activity */

app.use('/view', (req, res) => {
	//res.redirect(/all)
	var filter = {'name' : req.query.name};
	Program.findOne(filter)
		.then((result) => {
			res.render('viewprogram', {'program' : result, 'requestedName' : req.query.name});
		})
		.catch((err) => {
			res.type('html').status(200);
			console.log('uh oh: ' + err);
			res.send(err);
		})
})
	
app.use('/delete', (req, res) => {
	var filter = {'name': req.query.name}; 
	Program.deleteOne(filter) 
		.then((status) => {
			if (status.deletedCount == 1) {
				res.render('deletedprogram', {'name' : filter})
			}
			else {
				res.json({'status': 'no program of that name'})
			}
		})
		.catch((err) => {
			res.type('html').status(200);
		    console.log('uh oh: ' + err);
		    res.send(err);
		})

	//res.redirect(all)
})


// import the Person class from Person.js
var Profile = require('./Profile.js');
//const SuggestedEdit = require('./SuggestedEdit.js');
const EditSuggestion = require('./EditSuggestion.js');


// endpoint for listing all persons
app.use('/allprofile', (req, res) => {
	Profile.find({})
		.then((profiles) => {
			res.render('allprofiles', {'profiles' : profiles})
		})
		.catch((err) => {
			res.type('html').status(200);
		    console.log('uh oh: ' + err);
		    res.send(err);
		})
})

app.use('/getAllProfiles', (req, res) => {
	var everyProfile = []; 
	profiles.forEach( (profile) => {
		everyProfile.push(profile); 
	})
	res.json(matches);
})

// endpoint for creating a new person
// this is the action of the "create a profile" form
// endpoint for listing all persons 
app.use('/createprofile', (req, res) => { 
	var newProfile = new Profile ({ 
		name: req.body.name, 
		username: req.body.username, 
		password: req.body.password, 
		pronouns: req.body.pronouns, 
		classyear: req.body.classyear, 
		programs: req.body.program
	}); 
	
	if (!req.body.name || !req.body.username || !req.body.username) { 
		res.send("Name is required to create a profile. Go back: <a href='/profileform'>Create a new profile</a>"); 
		return; 
	} 
	// write it to the database 
	Profile.findOne({username: req.body.username})
	.then(existingUsername => {
		if (existingUsername) {
			res.send("Username already exists. Go back: <a href='/profileform'>Create a new profile</a>");
		} else {
			newProfile.save() 
			.then((p) => { 
				console.log('successfully added ' + p.name + ' to the database'); 
				// use EJS to render the page that will be displayed 
				res.render('newprofile', {'profile': p}) 
			}) 
			.catch((err) => { 
				res.type('html').status(200); console.log('uh oh: ' + err); 
				// res.send(err); 
				res.send("Database Error Occured. Go back: <a href='/profileform'>Create a new profile</a>"); 
			})
		}
	})
	.catch((err) => { 
		res.type('html').status(200); console.log('uh oh: ' + err); 
		// res.send(err); 
		res.send("Database Error Occured. Go back: <a href='/profileform'>Create a new profile</a>"); 
	})
}); 

app.use('/profileform', (req, res) => {
	
	Program.find({})
	.then((programs) => {
		console.log(programs);
		res.render('profileform', {'programs': programs});
	})
	.catch((err) => {
		res.type('html').status(200);
		console.log('uh oh: ' + err);
		res.send(err);
	})
});

/* the two endpoints below here are for editing a person */

// this one shows the HTML form for editing the person
app.use('/showEdit', (req, res) => {
	var filter = { 'username' : req.query.username };
	// do a query to get the info for this person
	Profile.findOne(filter)
	.then((p) => {
		Program.find({})
		.then((programs) => {
			console.log(programs);
			res.render('editprofileform', {'profile' : p, "programs": programs})
		})
		.catch((err) => {
			res.type('html').status(200);
		    console.log('uh oh: ' + err);
		    res.send(err);
		})
		
	})
	.catch((err) => {
		res.type('html').status(200);
		console.log('uh oh: ' + err);
		res.send(err);
	})
})

// this endpoint is called when the user SUBMITS the form to edit a person
app.use('/editProfile', (req, res) => {
	// get the name and age from the BODY of the request
	var filter = { 'username' : req.body.username };
	var update = { password: req.body.password, name: req.body.name, 'pronouns' : req.body.pronouns, 'classyear' : req.body.classyear, 'programs' : req.body.program};
	console.log(req.body.program);
	// now update the person in the database
	Profile.findOneAndUpdate(filter, update)
	.then((orig) => { // 'orig' refers to the original object before we updated it
		res.render('editedprofile', {'username' : req.body.username, password: req.body.password, name: req.body.name, 'pronouns' : req.body.pronouns, 'classyear' : req.body.classyear, 'programs' : req.body.program})
	})
	.catch((err) => {
		res.type('html').status(200);
		console.log('uh oh: ' + err);
		res.send(err);
	})

})

app.use('/viewprofile', (req, res) => {
	//res.redirect(/all)
	var viewprofile = {'username' : req.query.username};
	Profile.findOne(viewprofile)
		.then((result) => {
			res.render('viewprofile', {'profile' : result, 'requestedUsername' : req.query.username});
		})
		.catch((err) => {
			res.type('html').status(200);
			console.log('uh oh: ' + err);
			res.send(err);
		})
})

app.use('/deleteprofile', (req, res) => {
	var filter = {'username': req.query.username}; 
	Profile.deleteOne(filter) 
		.then((status) => {
			if (status.deletedCount == 1) {
				res.render('deletedprofile', {'username' : filter})
			}
			else {
				res.json({'status': 'no profile with that username'})
			}
		})
		.catch((err) => {
			res.type('html').status(200);
		    console.log('uh oh: ' + err);
		    res.send(err);
		})

	//res.redirect(all)
})

app.use('/suggestEdit', (req, res) => {
 var newSuggestedEdit = new EditSuggestion({
	programToEdit: req.query.programName,
 	suggestedEdit: req.query.suggestedEdit,
	editID: editCount
 });

 editCount = editCount + 1
 
 newSuggestedEdit.save() 
		.then((p) => { 
			console.log('successfully added ' + p.programToEdit + ' to the database'); 
			res.json({"status":"connection worked!"});
			// use EJS to render the page that will be displayed 
			//res.render('newsuggestededit', {'SuggestedEdit': s}) 
			//res.json({'name':programToEdit, 'edit':suggestedEdit});
		}) 
		.catch((err) => { 
			res.type('html').status(200); console.log('uh oh: ' + err); 
			// res.send(err); 
			res.send("Database Error Occured."); 
		})
})

app.use('/allSuggestedEdits', (req, res) => {
	EditSuggestion.find({})
		.then((suggestedEdits) => {
			res.render('suggestededits', {'suggestedEdits' : suggestedEdits})
		})
	.catch((err) => {
		res.type('html').status(200);
		console.log('uh oh: ' + err);
		res.send(err);
	})
})

app.use('/deleteEdit', (req, res) => {
	var filter = {'editID': req.query.name}; 
	EditSuggestion.deleteOne(filter) 
		.then((status) => {
		if (status.deletedCount > 0) {
				res.render('deletededit', {'editID' : filter})
		}
		else {
		 		res.json({'status': 'no edit of that name'})
		 	}
		})
		.catch((err) => {
			res.type('html').status(200);
		    console.log('uh oh: ' + err);
		    res.send(err);
		})

	//res.redirect(all)
})

app.use('/changePassword', (req,res) => {
	var filter = {'name': req.query.name}; 
	var update = {username: req.body.username, password: req.query.newPassword, 'pronouns' : req.body.pronouns, 'classyear' : req.body.classyear, 'programs' : req.body.program};
	console.log(filter);
	console.log(update);
	Profile.findOneAndUpdate(filter, update, {new: true})
	.then((orig) => { // 'orig' refers to the original object before we updated it
		res.render('editedprofile', {'name' : req.query.name, username: orig.username,  password: req.query.newPassword, 'pronouns' : orig.pronouns, 'classyear' : orig.classyear, 'programs' : orig.program})
		console.log('Updated Profile:', orig);
	})
	.catch((err) => {
		res.type('html').status(200);
		console.log('uh oh: ' + err);
		res.send(err);
	})
})

var SpotlightProgram = require('./SpotlightProgram.js');
//http://localhost:3010/spotlight?name=Ladders for Leaders
app.use('/spotlight', (req, res) => {
    var filter = {'name' : req.query.name};
    Program.findOne(filter)
    .then((result) => {
        SpotlightProgram.find({})
        .then((spotlightedProgram) => {
            if(spotlightedProgram.length == 0) {
                var newSpotlightedProgram = new SpotlightProgram({
                    name: result.name,
                    link: result.link,
                    category: result.category,
                    deadline: result.deadline,
                    applicableYear: result.applicableYear,
                    programDates: result.programDates,
                    gpaReq: result.gpaReq,
                    alumniEmail: result.alumniEmail
                });
                newSpotlightedProgram.save()
                    .then((p) => {
                        console.log('successfully spotlighted ' + p.name + ' to the database');
                        res.render('newspotlight', {'spotlight': p})
                    })
                    .catch((err) => {
                        res.type('html').status(200); console.log('uh oh: ' + err);
                    })
            }
            else {
                res.render('errordeletedspotlight', {'spotlight': result});
            }
        })
    })
    .catch((err) => {
        res.type('html').status(200);
        console.log('failed to spotlight: ' + err);
        res.send(err);
    })
})


app.use('/deleteSpotlight', (req, res) => {
    var filter = {'name': req.query.name};
    SpotlightProgram.deleteOne(filter)
        .then((status) => {
            if (status.deletedCount == 1) {
                res.render('deletedspotlight', {'name' : filter})
            }
            else {
                res.json({'status': 'no program of that name'})
            }
        })
        .catch((err) => {
            res.type('html').status(200);
            console.log('uh oh: ' + err);
            res.send(err);
        })
})


/* shows the spotlighted program at the web app */
app.use('/allSpotlighted', (req, res) => {
    SpotlightProgram.find({})
        .then((spotlightedPrograms) => {
            res.render('viewspotlighted', {'spotlightedPrograms' : spotlightedPrograms})
        })
    .catch((err) => {
        res.type('html').status(200);
        console.log('uh oh: ' + err);
        res.send(err);
    })
})


/* this endpoint sends a spotlighted program to android */
app.use('/getSpotlightedProgram', (req, res) => {
    SpotlightProgram.find({})
    .then((spotlightedProgram) => {
        res.json(spotlightedProgram);
    })
    .catch((err) => {
        res.type('html').status(200);
        console.log('uh oh: ' + err);
        res.send(err);
    })  
})

/*************************************************
Do not change anything below here!
*************************************************/

app.use('/public', express.static('public'));

// this redirects any other request to the "all" endpoint
app.use('/', (req, res) => { res.redirect('/all'); } );

// this port number has been assigned to your group
var port = 3010

app.listen(port,  () => {
	console.log('Listening on port ' + port);
    });
