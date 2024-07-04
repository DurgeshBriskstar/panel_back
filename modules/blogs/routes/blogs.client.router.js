const express = require('express');
const Router = express.Router();
const blogController = require("../controllers/blogs.client.controllers");

Router.post('/get/:id?', blogController.Get);

module.exports = Router;