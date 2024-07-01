const express = require('express');
const Router = express.Router();
const categoryController = require("../controllers/categories.client.controllers");

Router.post('/get/:id?', categoryController.Get);

module.exports = Router;