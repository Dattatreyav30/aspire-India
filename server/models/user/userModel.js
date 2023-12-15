const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const user = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: Sequelize.STRING,
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
  DOJ: {
    type: Sequelize.DATE,
  },
  gender: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
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
  tower: {
    type: Sequelize.BIGINT,
    defaultValue: 100,
  },
  profile_picture: {
    type: Sequelize.STRING,
  },
});

module.exports = user;
