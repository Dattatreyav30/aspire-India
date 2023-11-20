const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const CommunityPosts = sequelize.define("communityPosts", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  imageUrlS3: {
    type: Sequelize.STRING,
  },
  likeCount: {
    type: Sequelize.INTEGER,   
    defaultValue: 0,
  },
  commentsCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  userName  : {
    type : Sequelize.STRING,
    allowNull : false
  }
});

module.exports = CommunityPosts;
