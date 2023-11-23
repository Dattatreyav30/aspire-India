const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const precuratedMessages = sequelize.define("PrecuratedMessages", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  messageName: {
    type: Sequelize.STRING, 
  },
});

module.exports = precuratedMessages;
