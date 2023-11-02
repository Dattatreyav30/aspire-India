const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const tinyHabitsCompletion = sequelize.define('tinyHabitsCompletion', {
 id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = tinyHabitsCompletion;
