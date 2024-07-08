const express = require("express");
const UserController = require("../controllers/user.server.controllers");
const Router = express.Router();


Router.get('/information', UserController.Info);

Router.post('/general/update', UserController.updateInfo);
Router.post('/social/update', UserController.updateInfo);
Router.post('/password/update', UserController.updateInfo);

module.exports = Router;