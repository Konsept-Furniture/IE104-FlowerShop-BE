const userRoute = require("./user");
const authRoute = require("./auth");
const cartRoute = require("./cart");
const orderRoute = require("./order");
const productRoute = require("./product");

const initRouter = (app) => {
  app.use("/api/users", userRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/products", productRoute);
  app.use("/api/carts", cartRoute);
  app.use("/api/orders", orderRoute);
};

module.exports = initRouter;
