const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const CommunityPostsComntsModel = sequelize.define("CommunityPostsComnts", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  time: {
    type: Sequelize.DATE,
  },
});
module.exports = CommunityPostsComntsModel;
