const mongoose = require("mongoose");
const path = require('path');
const { sendResponse } = require("../../helper/common");
const { UserModel, UserInfoModel } = require("../models/users.server.models");
const { userFormValidations } = require("../../helper/validations");
const { convertUTCtoLocal, saveFileAndContinue, ensureDirectoryExistence } = require("../../../helper/common");
const { userPath } = require("../../../helper/paths");

const basicInfo = async (req, res) => {
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

const fullInfo = async (req, res) => {
    try {
        if (req?.user?.id) {
            let pipeline = [
                { $match: { email: req?.user?.email } },
                { $lookup: { from: 'user_infos', localField: '_id', foreignField: 'userId', as: 'userInfo' } },
                { $unwind: '$userInfo' },
                {
                    $project: {
                        firstName: '$firstName',
                        lastName: '$lastName',
                        email: '$email',
                        role: '$role',
                        gender: '$gender',
                        image: '$image',
                        imageUrl: '$imageUrl',
                        status: '$status',
                        lastLoginAt: convertUTCtoLocal("$lastLoginAt", "Asia/Kolkata"),
                        loginCount: '$loginCount',


                        about: '$userInfo.about',
                        dateOfBirth: convertUTCtoLocal('$userInfo.dateOfBirth', "Asia/Kolkata"),
                        secondaryEmail: '$userInfo.secondaryEmail',
                        primaryPhone: '$userInfo.primaryPhone',
                        secondaryPhone: '$userInfo.secondaryPhone',
                        address: '$userInfo.address',
                        socialLinks: '$userInfo.socialLinks',
                    }
                }
            ];

            const users = await UserModel.aggregate(pipeline);

            if (!users?.length) {
                return sendResponse(res, false, 400, {}, "User not found!");
            }
            else {
                let withoutPassword = users[0];
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
            let userRecord = {};
            let userInfoRecord = {};
            if (req?.path.includes("general")) {
                userRecord.firstName = formData?.firstName;
                userRecord.lastName = formData?.lastName;
                userRecord.gender = formData?.gender;
                // userRecord.email = formData?.email;
                userRecord.status = formData.active ? 1 : 0;

                userInfoRecord.userId = formData?.userId;
                userInfoRecord.dateOfBirth = formData?.dateOfBirth;
                userInfoRecord.about = formData?.about;
                userInfoRecord.secondaryEmail = formData?.secondaryEmail;
                userInfoRecord.primaryPhone = formData?.primaryPhone;
                userInfoRecord.secondaryPhone = formData?.secondaryPhone;
                userInfoRecord.address = formData?.address;
            } else if (req?.path.includes("password")) {
                console.log("password");
            } else {
                userInfoRecord.socialLinks = formData?.socialLinks || {};
            }

            if (formData?.image) {
                const matches = formData?.image?.match(/^data:(.+);base64,(.+)$/);
                if (matches) {
                    const ext = matches[1].split('/')[1];
                    const data = matches[2];
                    const buffer = Buffer.from(data, 'base64');
                    const imageName = `${Date.now()}.${ext}`;
                    const imagePath = path.join(userPath.upload, imageName);

                    // Ensure directory exists
                    ensureDirectoryExistence(imagePath);
                    const fileStatus = await saveFileAndContinue(imagePath, buffer);
                    if (fileStatus) {
                        userRecord.image = imageName;
                        userRecord.imageUrl = `${userPath.get}/${imageName}`;
                    }
                }
            } else {
                userRecord.image = "";
                userRecord.imageUrl = "";
            }


            const userInfo = await UserInfoModel.findOneAndUpdate({ userId: recordId }, { $set: userInfoRecord }, { new: true, upsert: true });
            const user = await UserModel.findByIdAndUpdate(recordId, { $set: userRecord });

            let withoutPassword = user.toObject();
            delete withoutPassword.password;

            return sendResponse(res, true, 200, withoutPassword, "Information updated successfully!");
        }
        return sendResponse(res, false, 400, {}, "Something went wrong, Please try again with correct credentials!");
    } catch (error) {
        console.log("error", error?.message);
        return sendResponse(res, false, 400, {}, "Something went wrong, Please try again with correct credentials!");
    }
}

module.exports = {
    basicInfo,
    fullInfo,
    updateInfo
}