const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
    
});

module.exports = mongoose.model("UserData", userModel);