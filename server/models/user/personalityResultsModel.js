const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const personalityResults = sequelize.define("personalityResults", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = personalityResults;
