const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const Skills = sequelize.define('skills',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      skillName : {
        type : Sequelize.STRING
      }
})

module.exports = Skills