const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const personalityQuestions = sequelize.define("personalityQuestions", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  questionName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = personalityQuestions;
