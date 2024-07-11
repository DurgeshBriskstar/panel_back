const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { sendResponse } = require("../../helper/common");
const { STATUS_ACTIVE } = require("../../helper/flags");
const { UserModel, UserInfoModel } = require("../../users/models/users.server.models");
const JWT_KEY = process.env.JWT_KEY;
const { firstUserSetup } = require("../../../config/setup");

const SignUp = async (req, res) => {

    if (req?.path === '/user-setup') {
        const userInfo = firstUserSetup();
        req.body = userInfo || {};
    }

    if (req?.body?.email) {
        try {
            let exist = await UserModel.countDocuments({ email: req?.body?.email });
            if (exist) {
                return sendResponse(res, false, 400, {}, "Email already exist, Please try with another email or login with the existing email address!");
            }

            let hashed = (req?.body?.password) ? await bcrypt.hash(req?.body?.password, 10) : "";
            let record = {
                "firstName": req?.body?.firstName,
                "lastName": req?.body?.lastName,
                "email": req?.body?.email,
                "password": hashed,
                "role": req?.body?.role,
            }
            let userInfoRecord = {
                country: "India",
            };
            let saveData = new UserModel(record);
            let user = await saveData.save();

            let saveInfoData = new UserInfoModel(userInfoRecord);
            await saveInfoData.save();


            let withoutPassword = user.toObject();
            delete withoutPassword.password;
            return sendResponse(res, true, 200, withoutPassword, "User registered successfully!");
        } catch (error) {
            const transformedObject = {};
            for (const key in error?.errors) {
                if (error?.errors.hasOwnProperty(key)) {
                    transformedObject[key] = error?.errors[key].message;
                }
            }
            return sendResponse(res, false, 400, {}, transformedObject);
        }
    }
    return sendResponse(res, false, 400, {}, "Something went wrong, Please try again with your details!");
}

const SignIn = async (req, res) => {
    try {
        if (req?.body?.email && req?.body?.password) {
            let user = await UserModel.findOne({ email: req?.body?.email });

            if (!Object.values(user)?.length) {
                return sendResponse(res, false, 400, {}, "Email not registered!");
            }

            if (user?.status !== STATUS_ACTIVE) {
                return sendResponse(res, false, 400, {}, "Your account currently inactivate, Please contact administrator!");
            }
            let hashed = await bcrypt.compare(req?.body?.password, user?.password);
            if (!hashed) {
                return sendResponse(res, false, 400, {}, "Invalid password!");
            }
            else {
                var token = jwt.sign({
                    id: user?._id,
                    firstname: user?.firstname,
                    lastname: user?.lastname,
                    email: user?.email,
                    role: user?.role,
                }, JWT_KEY, { expiresIn: "2h" });
                let withoutPassword = user.toObject();
                delete withoutPassword.password;
                let loggedInUser = {
                    user: withoutPassword,
                    token: token,
                }

                const record = {
                    lastLoginAt: new Date(),
                    loginCount: user?.loginCount ? user?.loginCount + 1 : 1,
                };
                await UserModel.findByIdAndUpdate(user?._id, { $set: record }, { new: true });

                return sendResponse(res, true, 200, loggedInUser, "LoggedIn successfully!");
            }
        }
        return sendResponse(res, false, 400, {}, "Something went wrong, Please try again with correct credentials!");
    } catch (error) {
        console.log("error", error?.message);
        return sendResponse(res, false, 400, {}, "Something went wrong, Please try again with correct credentials!");
    }
}

module.exports = {
    SignUp,
    SignIn,
}