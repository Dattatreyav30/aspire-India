const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const CommunityPostsLikes = sequelize.define("CommunityPostsLikes", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },       
  emoji_type: {
    type: Sequelize.STRING(255), // Or Sequelize.TEXT
    allowNull: false,
    charset: 'utf8mb4', // Ensure proper support for Unicode characters
  },     
});

module.exports = CommunityPostsLikes;
