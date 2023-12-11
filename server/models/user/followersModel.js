const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const followersModel = sequelize.define("followersModel", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  followerName : {
    type : Sequelize.STRING,
    allowNull : false
  },
  userName : {
    type : Sequelize.STRING,
    allowNull : false
  }
});

module.exports = followersModel;
