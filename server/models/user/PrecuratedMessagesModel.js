const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const PrecuratedMessages = sequelize.define("PrecuratedMessages", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  messageName: {
    type: Sequelize.STRING, 
  },
});

module.exports = PrecuratedMessages;
