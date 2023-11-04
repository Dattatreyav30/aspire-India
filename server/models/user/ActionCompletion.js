const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const ActionCompletion = sequelize.define('ActionCompletion', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  imageUrlS3: {
    type: Sequelize.STRING,
  },
  audioUrlS3: {
    type: Sequelize.STRING,
  },
  text: {
    type: Sequelize.STRING,
  },
  locationName: {
    type: Sequelize.STRING,
  },
  dayRecord: {
    type: Sequelize.DATE,
  },
  frequency: {
    type: Sequelize.INTEGER,
  },
});

module.exports = ActionCompletion;