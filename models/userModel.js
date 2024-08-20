    const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true , "Name is required!"]
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        unique: true
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
    },
    phone: {
        type: Number,
        required: [true, "Number is required!"],
    },
    password: {
        type: String,
        required : [true, "Password is required!"]
    }
});

module.exports = mongoose.model("User", userSchema);