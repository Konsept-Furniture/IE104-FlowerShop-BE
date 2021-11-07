const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db/index");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const productRoute = require("./routes/product");
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
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});
