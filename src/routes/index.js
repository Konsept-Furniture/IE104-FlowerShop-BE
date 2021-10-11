const userRouter = require("./users");

function route(app) {
  app.use("/api/user", userRouter);
}

module.exports = route;
