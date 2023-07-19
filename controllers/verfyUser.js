const users = require("../models/auth.js");
const verify = require("../models/verify.js")
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();




const getOtp = () => {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

const sendEmailFunc = (user, otp) => {
    const transporter = nodemailer.createTransport({
        port: 587,
        service: "gmail",
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_CODE
        }
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Verification of account",
        html: '<p>Hi ' + user.name + ', your otp for account verification is <b>' + otp + '</b>.</p>'
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Email Sent Successfully");
        }
    })
}

module.exports.sendEmail = async (req, res) => {

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('Invalid Id...');

    }
    try {
        const user = await users.findById(id);
        const verifyUser = await verify.findOne({ userId: id });
        if (!verifyUser) {
            const otp = getOtp();
            const newVerify = await verify.create({ userId: id, otp: otp })
            sendEmailFunc(user, otp);
            res.status(200).json(newVerify);
        }
        else {
            const otp = getOtp();
            const updated = await verify.findOneAndUpdate({ userId: id }, { $set: { 'otp': otp } }, { new: true });
            sendEmailFunc(user, otp);
            res.status(200).json(updated);

        }


    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

module.exports.finalChange = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('Invalid Id...');
    }
    try {
        const updatedProfile = await users.findByIdAndUpdate(id, { $set: { 'isVerified': true } }, { new: true });
        // console.log(updatedProfile);

        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(405).json({ message: error.message })
    }
}