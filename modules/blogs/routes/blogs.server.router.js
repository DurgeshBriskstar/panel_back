const express = require('express');
const Router = express.Router();
const blogController = require("../controllers/blogs.server.controllers");
const { checkRole } = require('../../helper/verifyToken');

Router.post('/get/:id?', checkRole(["admin", "branch"]), blogController.Get);
Router.post('/image/upload', checkRole(["admin", "branch"]), blogController.uploadDescriptionImage);
Router.post('/form/:id?', checkRole(["admin", "branch"]), blogController.Form);
Router.post('/status/:id?', checkRole(["admin", "branch"]), blogController.UpdateStatus);
Router.delete('/delete/:id?', checkRole(["admin", "branch"]), blogController.Delete);

module.exports = Router;