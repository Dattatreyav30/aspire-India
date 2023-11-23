const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const userTeam = sequelize.define("userTeam", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = userTeam;
