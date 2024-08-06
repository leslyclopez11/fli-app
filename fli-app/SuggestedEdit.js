
var mongoose = require('mongoose');

// DO NOT CHANGE THE URL FOR THE DATABASE!
// Please speak to the instructor if you need to do so or want to create your own instance
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var suggestedEditSchema = new Schema({
    // link: String,
    programToEdit: String,
    suggestedEdit: String,
    //editID: number
    });

// export programSchema as a class called Program
module.exports = mongoose.model('SuggestedEdit', suggestedEditSchema);


