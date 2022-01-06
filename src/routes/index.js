const userRoute = require("./user");
const authRoute = require("./auth");
const cartRoute = require("./cart");
const orderRoute = require("./order");
const productRoute = require("./product");
const categoryRoute = require("./category");
const supplierRoute = require("./supplier");
const purchaseOrderRoute = require("./purchaseOrder");
const testRoute = require("./testRoute");

const initRouter = (app) => {
  app.use("/api/users", userRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/products", productRoute);
  app.use("/api/carts", cartRoute);
  app.use("/api/orders", orderRoute);
  app.use("/api/categories", categoryRoute);
  app.use("/api/suppliers", supplierRoute);
  app.use("/api/purchase-orders", purchaseOrderRoute);
  app.use("/test", testRoute);
  app.use("/test", (req, res) => {
    return res.json("Hello to Furniture Shop");
  });
};

module.exports = initRouter;
