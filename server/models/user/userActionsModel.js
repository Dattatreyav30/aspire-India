const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const userActions = sequelize.define("useractions", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  isComplete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  frequency: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  duration: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  totalPoints:{
    type:Sequelize.INTEGER,
    allowNull:false
  }
});

module.exports = userActions;
