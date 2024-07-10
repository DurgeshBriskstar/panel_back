const express = require('express');
const Router = express.Router();
const graphicController = require("../controllers/graphic.server.controllers");
const { checkRole } = require('../../helper/verifyToken');

Router.post('/get/:id?', checkRole(["admin", "branch"]), graphicController.Get);
Router.post('/form/:id?', checkRole(["admin", "branch"]), graphicController.Form);
Router.post('/status/:id?', checkRole(["admin", "branch"]), graphicController.UpdateStatus);
Router.delete('/delete/:id?', checkRole(["admin", "branch"]), graphicController.Delete);

module.exports = Router;