const mongoose = require('./db');

var Schema = mongoose.Schema;


var SpotlightProgramSchema = new Schema({
    name: {type: String, required: true, unique: true},
    link: String,
    category: String,
    deadline: String,
    applicableYear: String,
    programDates: String,
    gpaReq: Number,
    alumniEmail: String
});


// export SpotlightedProgramSchema as a class called SpotlightedProgram
module.exports = mongoose.model('SpotlightedProgram', SpotlightProgramSchema);
