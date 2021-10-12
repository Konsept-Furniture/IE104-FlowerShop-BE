"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PurchaseContract extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PurchaseContract.init(
    {
      seller: DataTypes.INTEGER,
      receiveDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "PurchaseContract",
    }
  );
  return PurchaseContract;
};
