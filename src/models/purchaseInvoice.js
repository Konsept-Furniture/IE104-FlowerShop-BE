"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PurchaseInvoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PurchaseInvoice.init(
    {
      supplierId: DataTypes.INTEGER,
      totalPrice: DataTypes.DOUBLE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deleted: DataTypes.BOOLEAN, 
    },
    {
      sequelize,
      modelName: "PurchaseInvoice",
    }
  );
  return PurchaseInvoice;
};
