const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
    postBody: { type: String, required: "Must have some text. Cannot be empty." },
    postImg: { url: String, filename: String },
    userId: { type: String },
    createdAt: { type: Date, default: Date.now },
    likes: { type: [String], default: [] },
    userPosted: { type: String, required: "Must have an author." }
})

module.exports = mongoose.model("Post", postsSchema);