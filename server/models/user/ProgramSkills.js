const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const ProgramSkills = sequelize.define("programSkills", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = ProgramSkills;
