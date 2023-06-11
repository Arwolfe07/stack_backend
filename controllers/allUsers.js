const mongoose = require("mongoose");
const users = require("../models/auth.js");

module.exports.allUsers = async (req, res) => {
    try {
        const allUsers = await users.find();
        const usersDetails = [];
        allUsers.forEach(user => {
            usersDetails.push({ _id: user._id, name: user.name, about: user.about, tags: user.tags, joinedOn: user.joinedOn })
        })
        res.status(200).json(usersDetails);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

module.exports.updateProfile = async (req, res) => {
    const { id: _id } = req.params;
    const { name, about, tags } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('question unavailable...');
    }
    try {
        const updatedProfile = await users.findByIdAndUpdate(_id, { $set: { 'name': name, 'about': about, 'tags': tags } }, { new: true });
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(405).json({ message: error.message })
    }
}