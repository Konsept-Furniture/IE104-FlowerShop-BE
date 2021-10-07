const express = require("express");
const path = require("path");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

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


app.get('/', function (req, res) {
    return res.json("Hello");
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
