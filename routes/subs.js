const express = require("express");
const router = express.Router();
const subsController = require('../controllers/subs');




router.post('/checkout', subsController.updateSubs);



module.exports = router;