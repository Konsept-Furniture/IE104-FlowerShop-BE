const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const initRoute = require("./routes/index");
const cors = require("cors");

app.use(cors());

dotenv.config();
connectDB.connect();

//Middeware

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

initRoute(app);

module.exports = app;
