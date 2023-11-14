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
  isLogicJump : {
    type:Sequelize.BOOLEAN,
    defaultValue : false
  }
});

module.exports = personalityQuestions;
