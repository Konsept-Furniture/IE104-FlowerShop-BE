const express = require("express");
const path = require("path");
const morgan = require("morgan");
require("dotenv").config();
const connectDb = require("./config/connectDB");
const app = express();
const port = process.env.PORT || 5000;
const route = require("./routes/index");

connectDb();
//config app
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

//static path
app.use(express.static(path.join(__dirname, "public")));

//HTTP logger
app.use(morgan("combined"));

route(app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
