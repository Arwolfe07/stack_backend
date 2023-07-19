const express = require('express');
const userControl = require('../controllers/user.js');
const allUsers = require('../controllers/allUsers.js');
const verifyUser = require('../controllers/verfyUser.js');
// const auth = require('../middlerwares/auth.js');

const router = express.Router();

router.post('/signup', userControl.signup);
router.post('/login', userControl.login);

router.get('/allUsers', allUsers.allUsers);
router.patch('/allUsers/:id', allUsers.updateProfile);
// router.patch('/allusers/:id/verify', allUsers.verifyProfile);
router.post('/sendVerify/:id', verifyUser.sendEmail);
router.patch('/verify/:id', verifyUser.finalChange);
router.get('/friends/:id', userControl.getFriends);
router.put('/friend/:id', userControl.addFriend);
router.patch('/friend/:id', userControl.removeFriend);

module.exports = router;