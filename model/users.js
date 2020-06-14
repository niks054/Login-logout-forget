const mongoose = require('mongoose')

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    date: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: {
        type: String,
        required: false

    },
    resetPasswordExpires: {
        type: Date,
        required: false
    }
})
module.exports = User = mongoose.model('users', user)