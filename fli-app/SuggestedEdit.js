const mongoose = require('./db');
var Schema = mongoose.Schema;

var suggestedEditSchema = new Schema({
    // link: String,
    programToEdit: String,
    suggestedEdit: String,
    //editID: number
    });

// export programSchema as a class called Program
module.exports = mongoose.model('SuggestedEdit', suggestedEditSchema);


