const express = require('express');
const Router = express.Router();
const blogController = require("../controllers/blogs.server.controllers");
const { checkRole } = require('../../helper/verifyToken');

var multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/blogs')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const fileName = 'bn-' + uniqueSuffix + fileExtension;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

Router.get('/get/:id?', checkRole(["SuperAdmin", "Admin"]), blogController.Get);
Router.post('/form/:id?', checkRole(["SuperAdmin", "Admin"]), upload.single('image'), blogController.Form);
Router.delete('/delete/:id?', checkRole(["SuperAdmin", "Admin"]), blogController.Delete);

module.exports = Router;