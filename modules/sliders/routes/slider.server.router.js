const express = require('express');
const Router = express.Router();
const sliderController = require("../controllers/slider.server.controllers");
const { checkRole } = require('../../helper/verifyToken');

Router.post('/get/:id?', checkRole(["admin", "branch"]), sliderController.Get);
Router.post('/form/:id?', checkRole(["admin", "branch"]), sliderController.Form);
Router.post('/status/:id?', checkRole(["admin", "branch"]), sliderController.UpdateStatus);
Router.delete('/delete/:id?', checkRole(["admin", "branch"]), sliderController.Delete);

module.exports = Router;