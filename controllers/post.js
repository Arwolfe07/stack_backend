const post = require('../models/posts');
const { cloudinary } = require('../cloudinary');
const { default: mongoose } = require('mongoose');

module.exports.makeAPost = async (req, res) => {
    try {
        const { postBody, userPosted, userId } = req.body;
        const img = req.files && req.files[0];

        if (!img) {
            throw new Error('No image file provided');
        }

        const uploadResult = await cloudinary.uploader.upload(img.path);

        const postData = new post({
            postBody,
            userPosted,
            userId,
            postImg: {
                filename: uploadResult.public_id,
                url: uploadResult.secure_url,
            },
        });

        await postData.save();

        res.status(201).json(postData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create a post' });
    }
};

module.exports.getAllPosts = async (req, res) => {
    try {
        const allPosts = await post.find();
        res.status(200).json(allPosts);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

module.exports.likes = async (req, res) => {
    const { postId, userId, value } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(404).send('post unavailable...');
    }
    console.log(value)

    try {
        const postLiked = await post.findById(postId);
        if (value === 'like') {
            postLiked.likes.push(userId);
        } else if (value === 'unlike') {
            postLiked.likes = postLiked.likes.filter(id => id !== String(userId));
        }
        await post.findByIdAndUpdate(postId, postLiked);
        res.status(200).json({ message: 'liked/disliked...' });

    } catch (err) {
        res.status(404).json({ message: 'id not found' });
    }
}
