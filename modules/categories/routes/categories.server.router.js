const express = require('express');
const Router = express.Router();
const categoryController = require("../controllers/categories.server.controllers");
const { checkRole } = require('../../helper/verifyToken');

Router.post('/get/:id?', checkRole(["admin", "branch"]), categoryController.Get);
Router.post('/form/:id?', checkRole(["admin", "branch"]), categoryController.Form);
Router.post('/status/:id?', checkRole(["admin", "branch"]), categoryController.UpdateStatus);
Router.delete('/delete/:id?', checkRole(["admin", "branch"]), categoryController.Delete);

module.exports = Router;