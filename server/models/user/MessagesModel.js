const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const Messages = sequelize.define("Messages", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = Messages;
