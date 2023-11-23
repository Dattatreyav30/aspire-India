const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const messages = sequelize.define("Messages", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = messages;
