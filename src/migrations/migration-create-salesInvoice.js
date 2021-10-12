"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("SalesInvoice", {
      //   customerId: DataTypes.INTEGER,
      //   subTotal: DataTypes.DOUBLE,
      //   discount: DataTypes.DOUBLE,
      //   total: DataTypes.DOUBLE,
      //   status: DataTypes.INTEGER,
      //   createdAt: DataTypes.DATE,
      //   updatedAt: DataTypes.DATE,
      //   deleted: DataTypes.BOOLEAN,
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      customerId: {
        type: Sequelize.INTEGER,
      },
      subTotal: {
        type: Sequelize.DOUBLE,
      },
      total: {
        type: Sequelize.DOUBLE,
      },
      status: {
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
      deleted: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("SalesInvoice");
  },
};
