const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const userFeedback = sequelize.define("userFeedback", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = userFeedback