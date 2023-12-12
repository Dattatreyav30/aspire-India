const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const towerShapes = sequelize.define("towershapes", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  shapeUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  shapeType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = towerShapes;
