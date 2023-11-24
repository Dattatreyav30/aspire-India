const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const personalityQnRecModel = sequelize.define("personalityQnRecModel", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = personalityQnRecModel;
  