
const path = require('path');
const rootDir = path.resolve(__dirname, '../');
const baseUrl = process.env.BASE_URL;

const userPath = {
    upload: path.join(rootDir, 'uploads', 'users'),
    get: `${baseUrl}/uploads/users`
};

const websitePath = {
    upload: path.join(rootDir, 'uploads', 'website'),
    get: `${baseUrl}/uploads/website`
};

const categoryPath = {
    upload: path.join(rootDir, 'uploads', 'categories'),
    get: `${baseUrl}/uploads/categories`
};

const sliderPath = {
    upload: path.join(rootDir, 'uploads', 'sliders'),
    get: `${baseUrl}/uploads/sliders`
};

const blogPath = {
    upload: path.join(rootDir, 'uploads', 'blogs'),
    uploadDesc: path.join(rootDir, 'uploads', 'blogs', 'description'),
    get: `${baseUrl}/uploads/blogs`,
    getDesc: `${baseUrl}/uploads/blogs/description`
};

const graphicPath = {
    upload: path.join(rootDir, 'uploads', 'graphics'),
    get: `${baseUrl}/uploads/graphics`
};

module.exports = {
    userPath,
    websitePath,
    categoryPath,
    sliderPath,
    blogPath,
    graphicPath,
}