"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailContract extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DetailContract.init(
    {
      count: DataTypes.INTEGER,
      costPrice: DataTypes.DOUBLE,
      productId: DataTypes.INTEGER,
      contractId: DataTypes.INTEGER,
      satus: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "DetailContract",
    }
  );
  return DetailContract;
};
