const express = require('express');
const askQuestion = require('../controllers/askquestion.js');
const auth = require('../middlerwares/auth.js');

const router = express.Router();

router.post('/ask', auth, askQuestion.askQuestionPost);
router.get('/getAllQuestions', askQuestion.getAllQuestions);
router.delete('/delete/:id', auth, askQuestion.deleteQuestion);
router.patch('/vote/:id', askQuestion.voteQuestion);

module.exports = router;