const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const feedbackQuestions = sequelize.define("feedbackQuestions", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  question: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  day: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = feedbackQuestions;
