const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const userPrograms = sequelize.define("userprograms", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  isComplete: {
    type: Sequelize.INTEGER,
    defaultValue: false,
  },
  totalCompletedActions: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  totalActions: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  programScore: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

module.exports = userPrograms;
