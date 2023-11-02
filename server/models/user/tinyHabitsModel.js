const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const tinyHabits = sequelize.define('tinyHabits', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  habit_name: {
    type: Sequelize.STRING,
  },
});

module.exports = tinyHabits;
