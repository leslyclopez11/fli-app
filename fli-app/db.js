const mongoose = require('mongoose');

const uri = 'mongodb+srv://clara:sSIKmeiyBXpahulH@fli-app.s7duu.mongodb.net/?retryWrites=true&w=majority&appName=fli-app';

mongoose.connect(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

module.exports = mongoose;