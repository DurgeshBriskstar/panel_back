
const path = require('path');
const rootDir = path.resolve(__dirname, '../');
const categoryPath = {
    upload: path.join(rootDir, 'uploads', 'categories'),
    get: path.join(process.env.BASE_URL, 'uploads', 'categories'),
}

module.exports = {
    categoryPath
}