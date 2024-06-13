const express = require("express");
const MainRouter = express.Router();
const axios = require('axios');
const { verifyToken } = require('./modules/helper/verifyToken');

const authRouter = require("./modules/auth/routes/auth.server.router");
const userRouter = require("./modules/users/routes/user.server.router");
const categoryRouter = require("./modules/categories/routes/categories.server.router");
const blogRouter = require("./modules/blogs/routes/blogs.server.router");

MainRouter.use('/geolocation', async (req, res) => {
    try {
        const response = await axios.get('https://geolocation-db.com/json/');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

MainRouter.use('/auth', authRouter);

MainRouter.use('/user', verifyToken, userRouter);
MainRouter.use('/categories', verifyToken, categoryRouter);
MainRouter.use('/blogs', verifyToken, blogRouter);

module.exports = MainRouter;