"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SalesInvoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static SalesInvoice(models) {
      // define association here
    }
  }
  SalesInvoice.init(
    {
      customerId: DataTypes.INTEGER,
      subTotal: DataTypes.DOUBLE,
      discount: DataTypes.DOUBLE,
      total: DataTypes.DOUBLE,
      status: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "SalesInvoice",
    }
  );
  return SalesInvoice;
};
