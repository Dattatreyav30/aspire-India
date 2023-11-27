const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const actions = sequelize.define("actions", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
  },
  duration: {
    type: Sequelize.INTEGER,
  },
  points: {
    type: Sequelize.INTEGER,
  },
  geometricShape : {
    type : Sequelize.STRING,
    allowNull : false
  }
});

module.exports = actions;
