const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  DOB: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  DOJ: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  gender: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  totalPoints: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  isMobileVerified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  isEmailVerified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = User;
