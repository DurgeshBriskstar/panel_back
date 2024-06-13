const express = require("express");
const UserController = require("../controllers/user.server.controllers");
const Router = express.Router();


Router.get('/information', UserController.Info);

module.exports = Router;