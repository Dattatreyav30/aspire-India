const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const personalityOutcomes = sequelize.define('personalityOutcomes', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  outcomeName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = personalityOutcomes;
