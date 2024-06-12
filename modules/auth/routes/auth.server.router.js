const express = require("express");
const AuthController = require("../controllers/auth.server.controllers");
const Router = express.Router();

Router.post('/user-setup', AuthController.SignUp);

Router.post('/signup', AuthController.SignUp);

Router.post('/signin', AuthController.SignIn);

module.exports = Router;