const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const Streaks = sequelize.define("streaks", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  dailyStreak: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  weeklyStreak: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  monthlyStreak: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Streaks;
