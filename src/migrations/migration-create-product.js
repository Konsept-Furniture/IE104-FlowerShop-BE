"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Product", {
      // name: DataTypes.STRING,
      // image: DataTypes.STRING,
      // costPrice: DataTypes.DOUBLE,
      // price: DataTypes.DOUBLE,
      // inventoryId: DataTypes.INTEGER,
      // supplierId: DataTypes.INTEGER,
      // productTypeId: DataTypes.INTEGER,
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      costPrice: {
        type: Sequelize.DOUBLE,
      },
      price: {
        type: Sequelize.DOUBLE,
      },
      inventoryId: {
        type: Sequelize.INTEGER,
      },
      supplierId: {
        type: Sequelize.INTEGER,
      },
      productTypeId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Product");
  },
};
