var mongoose = require('mongoose');

// DO NOT CHANGE THE URL FOR THE DATABASE!
// Please speak to the instructor if you need to do so or want to create your own instance
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var programSchema = new Schema({
	name: {type: String, required: true, unique: true},
    link: String,
    category: String,
    location: String, 
    documentedStatus: String,
    deadline: String,
    applicableYear: String,
    programDates: String,
    gpaReq: Number,
    alumniEmail: String
	//age: Number
    });

// export programSchema as a class called Program
module.exports = mongoose.model('Program', programSchema);

// this is so that the names are case-insensitive
programSchema.methods.standardizeName = function() {
    this.name = this.name.toLowerCase();
    return this.name;
}
