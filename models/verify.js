const mongoose = require("mongoose");

const verifySchema = new mongoose.Schema({
    userId: String,
    otp: String,
})

module.exports = mongoose.model('verify',verifySchema);