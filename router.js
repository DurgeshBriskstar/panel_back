const express = require("express");
const MainRouter = express.Router();
const { verifyToken } = require('./modules/helper/verifyToken');

const authRouter = require("./modules/auth/routes/auth.server.router");
const categoryRouter = require("./modules/categories/routes/categories.server.router");
const blogRouter = require("./modules/blogs/routes/blogs.server.router");

MainRouter.use('/auth', authRouter);

MainRouter.use('/categories', categoryRouter);
MainRouter.use('/blogs', verifyToken, blogRouter);

module.exports = MainRouter;