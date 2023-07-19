
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    about: { type: String },
    tags: { type: [String] },
    joinedOn: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    membership: { type: String, enum: ['free', 'silver', 'gold'], default: 'free' },
    noOfQuestions: { type: Number, default: 1 },
    lastUpdate: { type: Date, default: Date.now },
    friends: {type: [String],default: []}
})

userSchema.pre('save', function (next) {
    if (this.membership === 'silver') {
        this.noOfQuestions = 5;
    } else if(this.membership === 'gold') {
        this.noOfQuestions = 1000;
    }
    next();

})

setInterval(async () => {
    const currentDate = new Date();
    const midnight = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 0, 0, 0);
    const usersToUpdate = await mongoose.model('User').find({ lastUpdate: { $lt: midnight } });
    for (const user of usersToUpdate) {
        if (user.membership === 'silver') {
            user.noOfQuestions = 5
        }
        else if (user.membership === 'gold') {
            user.noOfQuestions = 1000;
        }
        user.lastUpdate = currentDate;
        await user.save();
    }
}, 1000 * 60);

module.exports = mongoose.model("User", userSchema);