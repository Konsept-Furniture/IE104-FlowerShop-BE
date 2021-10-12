"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailSalesInvoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DetailSalesInvoice.init(
    {
      salesInvoiceId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      total: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: "DetailSalesInvoice",
    }
  );
  return DetailSalesInvoice;
};
