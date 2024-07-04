const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT
require("./config/connection");
const { MainRouter, WebRouter } = require("./router");

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static('uploads'));

//  ___________________________ PANEL ___________________________

app.use('/api', MainRouter);

//  ___________________________ WEB ___________________________

app.use('/client', WebRouter);






app.listen(PORT);