const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
    },
});

const UserInfoSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
    },
});

const UserModel = mongoose.model("users", UserSchema);
const UserInfoModel = mongoose.model("user_info", UserInfoSchema);

module.exports = { UserModel, UserInfoModel };