const Sequelize = require("sequelize");
const sequelize = require("../../util/database");
const { UUIDV4 } = require("sequelize"); // Import UUIDV4 from Sequelize

const skills = sequelize.define('skills',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      skillName : {
        type : Sequelize.STRING
      },
})

module.exports = skills