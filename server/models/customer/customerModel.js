const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const customer = sequelize.define("customer", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  contact: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  designation: {
    type: Sequelize.STRING,
  },
  views: {
    type: Sequelize.STRING,
  },
});

module.exports = customer;
