const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const personalityQnRecModel = sequelize.define("personalityQnRecModel", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  personalityOptionId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'PersonalityOptions', 
      key: 'id',
    },
  },
});

module.exports = personalityQnRecModel;
