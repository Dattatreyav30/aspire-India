const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const CommunityPostsLikes = sequelize.define('CommunityPostsLikes', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  time: {
    type: Sequelize.DATE, 
  },
});

module.exports = CommunityPostsLikes;
