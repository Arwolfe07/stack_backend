const mongoose = require("mongoose");
const questions = require("../models/question.js");

module.exports.postAnswer = async (req, res) => {
    const { id: _id } = req.params;
    const { answerBody, userAnswered, noOfAnswers, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('question unavailable...');
    }
    updateNoOfAnswers(_id, noOfAnswers);
    try {
        const updatedQuestion = await questions.findByIdAndUpdate(_id, { $addToSet: { 'answers': [{ answerBody, userAnswered,userId }] } });
        res.status(200).json(updatedQuestion);
    } catch (error) {
        res.status(400).json(error);
    }
}

const updateNoOfAnswers = async (_id, noOfAnswers) => {
    try {
        await questions.findByIdAndUpdate(_id, { $set: { 'noOfAnswers': noOfAnswers } });
    } catch (error) {
        console.log(error);
    }
}

module.exports.deleteAnswer = async (req, res) => {
    const { id: _id } = req.params;
    const { answerId, noOfAnswers } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('question unavailable...');
    }
    if (!mongoose.Types.ObjectId.isValid(answerId)) {
        return res.status(404).send('answer unavailable...');
    }
    updateNoOfAnswers(_id, noOfAnswers);
    try {
        await questions.updateOne({ _id }, { $pull: { 'answers': { _id: answerId } } });
        res.status(200).json({message: "Successfully deleted..."})
    } catch (error) {
        res.status(405).json(error);
    }
}

