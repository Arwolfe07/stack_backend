const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const users = require("../models/auth.js");


module.exports.signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(404).json({ message: 'User already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 12); // second argument is salt
        const newUser = await users.create({ email, name, password: hashedPassword });
        const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ result: newUser, token });
    } catch (error) {
        res.status(500).json("Something went wrong...");
    }

};

module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await users.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User don\'t exist' });
        }

        const isPasswordCrt = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCrt) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ result: existingUser, token });

    } catch (error) {
        res.status(500).json("Something went wrong...");
    }
};