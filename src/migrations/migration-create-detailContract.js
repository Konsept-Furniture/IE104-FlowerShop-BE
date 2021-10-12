"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("DetailContract", {
      //   count: DataTypes.INTEGER,
      //   costPrice: DataTypes.DOUBLE,
      //   productId: DataTypes.INTEGER,
      //   contractId: DataTypes.INTEGER,
      //   satus: DataTypes.STRING,
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      count: {
        type: Sequelize.STRING,
      },
      costPrice: {
        type: Sequelize.STRING,
      },
      productId: {
        type: Sequelize.DOUBLE,
      },
      contractId: {
        type: Sequelize.DOUBLE,
      },
      satus: {
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
    await queryInterface.dropTable("DetailContract");
  },
};
