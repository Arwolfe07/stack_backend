const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
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

module.exports.addFriend = async (req, res) => {
    const { id: _id } = req.params;
    const { friendId } = req.body;
    console.log(_id);
    console.log(friendId);
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('Not verified...');
    }
    try {
        const friend = await users.findById(friendId);
        const user = await users.findById(_id);
        const exists = user.friends.findIndex(el => el === String(friendId));
        if (exists === -1) {
            user.friends.push(friendId);

        }
        else {
            alert("User Already friend..");
        }
        await users.findByIdAndUpdate(_id, user);
        res.status(200).json({ message: 'added friend...' });
    } catch (err) {
        res.status(404).json({ message: 'not added friend...' });
    }
}

module.exports.removeFriend = async (req, res) => {
    const { id: _id } = req.params;
    const { friendId } = req.body;
    console.log(_id);
    console.log(friendId);
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('Not verified...');
    }
    try {
        const friend = await users.findById(friendId);
        const user = await users.findById(_id);
        const exists = user.friends.findIndex(el => el === String(friendId));
        if (exists>=0) {
            user.friends = user.friends.filter(id => id!==friendId);
        }
        await users.findByIdAndUpdate(_id, user);
        res.status(200).json({ message: 'removed friend...' });
    } catch (err) {
        res.status(404).json({ message: 'no removed friend...' });
    }
}

module.exports.getFriends = async (req, res) => {
    const { id: _id } = req.params;
    console.log(_id);
    try {
        const user = await users.findById(_id);
        console.log(user);

        const friends = [];

        for (const friendId of user.friends) {
            const friend = await users.findById(friendId);
            friends.push(friend);
        }
        res.status(200).json(friends);
    } catch (err) {
        res.status(404).json({ message: err.message });

    }
}