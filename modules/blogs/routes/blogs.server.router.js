const express = require('express');
const Router = express.Router();
const blogController = require("../controllers/blogs.server.controllers");
const { checkRole } = require('../../helper/verifyToken');

Router.post('/get/:id?', checkRole(["admin", "branch"]), blogController.Get);
Router.post('/form/:id?', checkRole(["admin", "branch"]), blogController.Form);
Router.delete('/delete/:id?', checkRole(["admin", "branch"]), blogController.Delete);

module.exports = Router;