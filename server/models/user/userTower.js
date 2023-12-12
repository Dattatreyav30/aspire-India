const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const userTower = sequelize.define("userTower", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  shapeType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  currTowerMeter: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = userTower;
