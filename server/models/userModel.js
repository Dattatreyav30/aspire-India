const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const User = sequelize.define('user', {
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
    },
    name: {
      type: Sequelize.STRING,
    },
    DOB: {
      type: Sequelize.DATE,
    },
    totalPoints: {
      type: Sequelize.INTEGER,
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
  