const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionTitle: { type: String, required: "Question must have a title" },
    questionBody: { type: String, required: "Question must have a body" },
    questionTags: { type: [String], required: "Question must have tags" },
    noOfAnswers: { type: Number, default: 0 },
    upVote: { type: [String], default: [] },
    downVote: { type: [String], default: [] },
    userPosted: { type: String, required: "Question must have an author" },
    userId: { type: String },
    paskedOn: { type: Date, default: Date.now },
    answers: [{
        answerBody: String,
        userAnswered: String,
        userId: String,
        answeredOn: { type: Date, default: Date.now }
    }]
})

module.exports = mongoose.model("Question", questionSchema);