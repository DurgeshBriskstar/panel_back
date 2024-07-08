const mongoose = require("mongoose");
const { sendResponse } = require("../../helper/common");
const { UserModel, UserInfoModel } = require("../models/users.server.models");
const { userFormValidations } = require("../../helper/validations");

const Info = async (req, res) => {
    try {
        if (req?.user?.id) {
            let user = await UserModel.findOne({ email: req?.user?.email });
            if (!Object.values(user)?.length) {
                return sendResponse(res, false, 400, {}, "User not found!");
            }
            else {
                let withoutPassword = user.toObject();
                delete withoutPassword.password;
                return sendResponse(res, true, 200, withoutPassword, "Information get successfully!");
            }
        }
        return sendResponse(res, false, 400, {}, "Something went wrong, Please try again with correct credentials!");
    } catch (error) {
        console.log("error", error?.message);
        return sendResponse(res, false, 400, {}, "Something went wrong, Please try again with correct credentials!");
    }
}

const updateInfo = async (req, res) => {
    try {
        if (!req?.body) return sendResponse(res, false, 400, {}, "No data provided!");
        const formData = req.body;
        const formParams = req.params;
        const recordId = formData?.userId || new mongoose.Types.ObjectId;
        const newRecord = formParams.id ? false : true;

        let errors = userFormValidations(formData);
        if (Object.keys(errors).length) return sendResponse(res, false, 400, errors, "Validation failed!");
        if (formData?.userId) {

            let record = {};
            if (req?.path.includes("general")) {
                console.log("general");
            }
            else if (req?.path.includes("password")) {
                console.log("password");
            } else {
                record.socialLinks = formData?.socialLinks || {};
            }
            const options = { new: true, upsert: true };
            const user = await UserInfoModel.findByIdAndUpdate(recordId, { $set: record }, options);



            let withoutPassword = user.toObject();
            delete withoutPassword.password;

            return sendResponse(res, true, 200, withoutPassword, "Information updated successfully!");
        }



        // if (req?.user?.id) {
        //     let user = await UserModel.findOne({ email: req?.user?.email });
        //     if (!Object.values(user)?.length) {
        //         return sendResponse(res, false, 400, {}, "User not found!");
        //     }
        //     else {

        //         const record = {
        //             lastLoginAt: new Date(),
        //             loginCount: user?.loginCount ? user?.loginCount + 1 : 1,
        //         };
        //         const user = await UserModel.findByIdAndUpdate(user?._id, { $set: record }, { new: true });

        //         let withoutPassword = user.toObject();
        //         delete withoutPassword.password;
        //         return sendResponse(res, true, 200, withoutPassword, "Information updated successfully!");
        //     }
        // }
        return sendResponse(res, false, 400, {}, "Something went wrong, Please try again with correct credentials!");
    } catch (error) {
        console.log("error", error?.message);
        return sendResponse(res, false, 400, {}, "Something went wrong, Please try again with correct credentials!");
    }
}

module.exports = {
    Info,
    updateInfo
}