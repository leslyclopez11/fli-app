
	var mongoose = require('mongoose');

	// DO NOT CHANGE THE URL FOR THE DATABASE!
	// Please speak to the instructor if you need to do so or want to create your own instance
	mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');
	
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
	
