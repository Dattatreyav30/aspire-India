const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const communityPostsComntsModel = sequelize.define("CommunityPostsComnts", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  time: {
    type: Sequelize.DATE,
  },
});
module.exports = communityPostsComntsModel;
