
const path = require('path');
const rootDir = path.resolve(__dirname, '../');
const baseUrl = process.env.BASE_URL;

const categoryPath = {
    upload: path.join(rootDir, 'uploads', 'categories'),
    get: `${baseUrl}/uploads/categories`
};

module.exports = {
    categoryPath
}