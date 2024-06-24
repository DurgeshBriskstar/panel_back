const jwt = require("jsonwebtoken");
const { UserModel } = require("../users/models/users.server.models");
const { sendResponse } = require("./common");
const JWT_KEY = process.env.JWT_KEY;

const verifyToken = (req, res, next) => {
    const authorizationHeader = req?.headers?.authorization;
    if (!authorizationHeader) {
        return sendResponse(res, false, 401, {}, "Unauthorized: No token provided!");
    }
    const token = authorizationHeader.split(" ")[1];
    jwt.verify(token, JWT_KEY, (err, decoded) => {
        if (err) {
            return sendResponse(res, false, 401, {}, "Unauthorized: Token is invalid or expired!");
        }
        req.user = decoded;
        next();
    });
};

const checkRole = (roles) => async (req, res, next) => {
    let user = await UserModel.findOne({ _id: req?.user?.id });

    if (roles && user && roles?.includes(user?.role)) {
        next();
    } else {
        return sendResponse(res, false, 401, {}, "Unauthorized: You don't have valid permissions!");
    }
}

module.exports = {
    verifyToken,
    checkRole
};