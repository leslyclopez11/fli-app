const mongoose = require('./db');

var Schema = mongoose.Schema;

var personSchema = new Schema({
	name: {type: String, required: true, unique: true},
	age: Number
    });

// export personSchema as a class called Person
module.exports = mongoose.model('Person', personSchema);

// this is so that the names are case-insensitive
personSchema.methods.standardizeName = function() {
    this.name = this.name.toLowerCase();
    return this.name;
}