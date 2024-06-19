const express = require('express');
const Router = express.Router();
const categoryController = require("../controllers/categories.server.controllers");
const { checkRole } = require('../../helper/verifyToken');

var multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/categories')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const fileName = 'cate-' + uniqueSuffix + fileExtension;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

Router.post('/get/:id?', checkRole(["admin", "branch"]), categoryController.Get);
Router.post('/form/:id?', checkRole(["admin", "branch"]), categoryController.Form);
Router.post('/status/:id?', checkRole(["admin", "branch"]), categoryController.UpdateStatus);
Router.delete('/delete/:id?', checkRole(["admin", "branch"]), categoryController.Delete);

module.exports = Router;