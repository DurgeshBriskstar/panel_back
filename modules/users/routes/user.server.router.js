const express = require("express");
const UserController = require("../controllers/user.server.controllers");
const Router = express.Router();
const { checkRole } = require('../../helper/verifyToken');


Router.get('/information', checkRole(["admin"]), UserController.fullInfo);

Router.post('/get/:id?', checkRole(["admin"]), UserController.Get);

Router.post('/general/update', checkRole(["admin"]), UserController.updateInfo);
Router.post('/social/update', checkRole(["admin"]), UserController.updateInfo);
Router.post('/password/update', checkRole(["admin"]), UserController.updateInfo);

module.exports = Router;