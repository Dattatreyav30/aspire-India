const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const actionCompletion = sequelize.define("ActionCompletion", {
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
});

module.exports = actionCompletion;
