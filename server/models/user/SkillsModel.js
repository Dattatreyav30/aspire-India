const Sequelize = require("sequelize");
const sequelize = require("../../util/database");
const { UUIDV4 } = require("sequelize"); // Import UUIDV4 from Sequelize

const Skills = sequelize.define('skills',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      skillName : {
        type : Sequelize.STRING
      },
      uniqueId: {
        type: Sequelize.CHAR(36),
        defaultValue: UUIDV4,
        unique: true,
      },
})

module.exports = Skills