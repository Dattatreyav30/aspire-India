const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const Team = sequelize.define("team", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  teamName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
  },
});

module.exports = Team;
