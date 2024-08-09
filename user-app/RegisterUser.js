const mongoose = require('../fli-app/db');

//connect?
// mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var newuserSchema = new Schema({
	username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    pronouns: { type: String, required: true },
    classyear: { type: String, required: true }
    });

const User = mongoose.model('User', newuserSchema);

module.exports = User;