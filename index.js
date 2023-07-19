const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user.js");
const askQuestionRoutes = require("./routes/askquestion.js");
const answerRoutes = require("./routes/answer.js");
const paymentRoutes = require("./routes/subs.js");
const postRoutes = require("./routes/post.js");
const app = express();
const dotenv = require('dotenv');

dotenv.config()
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.send("This is the first backend request");
})

app.use('/user', userRoutes);
app.use('/questions', askQuestionRoutes);
app.use('/answer', answerRoutes);
app.use('/payment', paymentRoutes);
app.use('/community', postRoutes);

const PORT = process.env.PORT || 5000;

const DB_URL = process.env.CONNECTION_URL;

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    }))
    .catch((err) => console.log(err.message));

