const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const personalityOptions = sequelize.define("personalityOptions", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  optionName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = personalityOptions;
