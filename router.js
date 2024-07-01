const express = require("express");
const MainRouter = express.Router();
const WebRouter = express.Router();
const axios = require('axios');
const { verifyToken } = require('./modules/helper/verifyToken');

const authRouter = require("./modules/auth/routes/auth.server.router");
const userRouter = require("./modules/users/routes/user.server.router");
const categoryRouter = require("./modules/categories/routes/categories.server.router");
const sliderRouter = require("./modules/sliders/routes/slider.server.router");
const blogRouter = require("./modules/blogs/routes/blogs.server.router");

// ________________________________________ PANEL ________________________________________

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
MainRouter.use('/sliders', verifyToken, sliderRouter);
MainRouter.use('/blogs', verifyToken, blogRouter);


// ________________________________________ WEB ________________________________________

const webCategoryRouter = require("./modules/categories/routes/categories.client.router");
// const webSliderRouter = require("./modules/sliders/routes/slider.client.router");
// const webBlogRouter = require("./modules/blogs/routes/blogs.client.router");

WebRouter.use('/categories', webCategoryRouter);

module.exports = {
    MainRouter,
    WebRouter,
};