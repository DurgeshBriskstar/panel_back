const { sendResponse } = require("../../helper/common");
const { UserModel } = require("../models/users.server.models");

const Info = async (req, res) => {
    try {
        if (req?.user?.id) {
            let user = await UserModel.find({ email: req?.user?.email });
            if (!user.length) {
                return sendResponse(res, false, 400, {}, "User not found!");
            }
            else {
                return sendResponse(res, true, 200, user[0], "Information get successfully!");
            }
        }
        return sendResponse(res, false, 400, {}, "Something went wrong, Please try again with correct credentials!");
    } catch (error) {
        console.log("error", error?.message);
        return sendResponse(res, false, 400, {}, "Something went wrong, Please try again with correct credentials!");
    }
}

module.exports = {
    Info,
}