const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String },

    gender: { type: String },
    image: { type: String },
    imageUrl: { type: String },
    status: { type: Number, comment: "0 Inactive, 1 Active, 2 Deleted" },
    lastLoginAt: { type: Date },
    loginCount: { type: Number, comment: "How many times logged in" },
});

const UserInfoSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId },
    about: { type: String },
    dateOfBirth: { type: Date },
    secondaryEmail: { type: String },
    primaryPhone: { type: String },
    secondaryPhone: { type: String },
    address: {
        streetAddress: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        pinCode: { type: String },
        country: { type: String },
    },
    socialLinks: {
        facebookLink: { type: String },
        instagramLink: { type: String },
        linkedinLink: { type: String },
        twitterLink: { type: String },
        pinterestLink: { type: String },
        youtubeLink: { type: String },
    }
});

const UserModel = mongoose.model("users", UserSchema);
const UserInfoModel = mongoose.model("user_info", UserInfoSchema);

module.exports = { UserModel, UserInfoModel };