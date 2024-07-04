const express = require('express');
const Router = express.Router();
const webController = require("../controllers/web.client.controllers");

Router.post('/get/:id?', webController.Get);

module.exports = Router;