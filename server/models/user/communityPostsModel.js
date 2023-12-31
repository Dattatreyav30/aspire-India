const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const communityPosts = sequelize.define("communityPosts", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title : {
    type : Sequelize.STRING,
    allowNull : false,
  },
  description : {
    type : Sequelize.STRING,
    allowNull : false
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
  },
  
});

module.exports = communityPosts;
