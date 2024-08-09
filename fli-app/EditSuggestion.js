const mongoose = require('./db');
var Schema = mongoose.Schema;

var editSuggestionSchema = new Schema({
    // link: String,
    programToEdit: String,
    suggestedEdit: String,
    editID: Number
    });

// export programSchema as a class called Program
module.exports = mongoose.model('EditSuggestion', editSuggestionSchema);


