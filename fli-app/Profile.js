const mongoose = require('./db');
var Schema = mongoose.Schema;

var profileSchema = new Schema({
	name: String, 
	// link: String,
	pronouns: String,
	classyear: String,
	username: {type: String, required: true, unique: true},
	password: String,
	programs: []
	});

// export programSchema as a class called Program
module.exports = mongoose.model('Profile', profileSchema);

// this is so that the names are case-insensitive
profileSchema.methods.standardizeName = function() {
	this.name = this.name.toLowerCase();
	return this.name;
}

