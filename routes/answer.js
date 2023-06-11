const express = require("express");
const auth = require('../middlerwares/auth.js');
const answerController = require("../controllers/answers.js");

const router = express.Router();

router.patch('/post/:id', auth, answerController.postAnswer);
router.patch('/delete/:id', auth, answerController.deleteAnswer);

module.exports = router;