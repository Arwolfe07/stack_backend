const express = require('express');
const userControl = require('../controllers/user.js');
const allUsers = require('../controllers/allUsers.js');

const router = express.Router();

router.post('/signup', userControl.signup);
router.post('/login', userControl.login);

router.get('/allUsers', allUsers.allUsers);
router.patch('/allUsers/:id', allUsers.updateProfile);

module.exports = router;