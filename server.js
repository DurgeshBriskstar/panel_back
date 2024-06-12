const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT
require("./config/connection");
const MainRouter = require("./router");

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api', MainRouter);

app.listen(PORT);