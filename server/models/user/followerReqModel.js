const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const followerReqModel = sequelize.define("followerReqModel", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  requestStatus : {
    type :Sequelize.STRING,
    defaultValue : 'Pending'
  }
});

module.exports = followerReqModel;
