const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("shop", "postgres", "123456", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

let connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
module.exports = connectDb;
