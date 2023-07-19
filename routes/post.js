const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.post('/post', upload.array('image', 1), postController.makeAPost);
router.get('/getAllPosts', postController.getAllPosts);
router.patch('/like',postController.likes);

module.exports = router;
