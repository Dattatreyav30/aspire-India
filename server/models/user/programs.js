const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const programs = sequelize.define("programs", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  programName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
  },
  totalPoints: {
    type: Sequelize.INTEGER,
  },
  duration: {
    type: Sequelize.INTEGER,
  },
});

module.exports = programs;
