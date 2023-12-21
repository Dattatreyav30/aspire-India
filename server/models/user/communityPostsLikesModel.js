const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const communityPostsLikes = sequelize.define("CommunityPostsLikes", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = communityPostsLikes;
