const mongoose = require('./db');
var Schema = mongoose.Schema;

var profileSchema = new Schema({
	name: {type: String, required: true},
	// link: String,
	pronouns: String,
	classyear: String,
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	programs: []
	});

// export programSchema as a class called Program
module.exports = mongoose.model('Profile', profileSchema);

// this is so that the names are case-insensitive
profileSchema.methods.standardizeName = function() {
	this.name = this.name.toLowerCase();
	return this.name;
}

