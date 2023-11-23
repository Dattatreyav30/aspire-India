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
});

module.exports = userActions;
