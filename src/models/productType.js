"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductType.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      parentId: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ProductType",
    }
  );
  return ProductType;
};
