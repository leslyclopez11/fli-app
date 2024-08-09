const mongoose = require('mongoose');

const uri = 'mongodb+srv://leslyclopez11:samira-0211@fli-app.s7duu.mongodb.net/?retryWrites=true&w=majority&appName=fli-app';

mongoose.connect(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

module.exports = mongoose;