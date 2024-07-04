const express = require('express');
const Router = express.Router();
const webController = require("../controllers/web.server.controllers");
const { checkRole } = require('../../helper/verifyToken');

Router.post('/get/:id?', checkRole(["admin", "branch"]), webController.Get);
// Router.post('/form/:id?', checkRole(["admin", "branch"]), webController.Form);
// Router.post('/status/:id?', checkRole(["admin", "branch"]), webController.UpdateStatus);

module.exports = Router;