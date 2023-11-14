const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const personalityLogicJump = sequelize.define("personalityLogicJump", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});      

module.exports = personalityLogicJump;
