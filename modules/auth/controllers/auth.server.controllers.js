const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { sendResponse } = require("../../helper/common");
const { UserModel } = require("../../users/models/users.server.models");
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
            let saveData = new UserModel(record);
            let user = await saveData.save();
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
            let user = await UserModel.find({ email: req?.body?.email });
            if (!user.length) {
                return sendResponse(res, false, 400, {}, "Email not registered!");
            }
            let hashed = await bcrypt.compare(req?.body?.password, user[0]?.password);
            if (!hashed) {
                return sendResponse(res, false, 400, {}, "Invalid password!");
            }
            else {
                var token = jwt.sign({
                    id: user[0]?._id,
                    firstname: user[0]?.firstname,
                    lastname: user[0]?.lastname,
                    email: user[0]?.email,
                    role: user[0]?.role,
                }, JWT_KEY, { expiresIn: "2h" });
                let withoutPassword = user[0].toObject();
                delete withoutPassword.password;
                let loggedInUser = {
                    user: withoutPassword,
                    token: token,
                }
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