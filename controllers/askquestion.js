const mongoose = require("mongoose");
const questions = require("../models/question.js");

module.exports.askQuestionPost = async (req, res) => {
    const postQuestionData = req.body;
    const postQuestion = new questions(postQuestionData);
    try {
        await postQuestion.save();
        res.status(200).json("Posted a new question successfully");
    } catch (e) {
        console.log(e);
        res.status(409).json("Couldn't post a new question");
    }
};

module.exports.getAllQuestions = async (req, res) => {
    try {
        const allQuestions = await questions.find();
        res.status(200).json(allQuestions);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
}

module.exports.deleteQuestion = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('question unavailable...');
    }
    try {
        await questions.findByIdAndRemove(_id);
        res.status(200).json({ message: "Successfully deleted..." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

module.exports.voteQuestion = async (req, res) => {
    const { id: _id } = req.params;
    const { userId, value } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('question unavailable...');
    }
    try {
        const question = await questions.findById(_id);
        const upIndex = question.upVote.findIndex((id) => id === String(userId));
        const downIndex = question.downVote.findIndex((id) => id === String(userId));
        if (value === 'upVote') {
            if (downIndex !== -1) {
                question.downVote = question.downVote.filter((id) => id !== String(userId));
            }
            if (upIndex === -1) {
                question.upVote.push(userId);
            }
            else {
                question.upVote = question.upVote.filter((id) => id !== String(userId));
            }
        }
        else if (value === 'downVote') {
            if (upIndex !== -1) {
                question.upVote = question.upVote.filter((id) => id !== String(userId));
            }
            if (downIndex === -1) {
                question.downVote.push(userId);
            }
            else {
                question.downVote = question.downVote.filter((id) => id !== String(userId));
            }
        }
        await questions.findByIdAndUpdate(_id, question);
        res.status(200).json({ message: 'voted successfully...' });
    } catch (error) {
        res.status(404).json({ message: 'id not found' });
    }
}