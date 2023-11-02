const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const ProgramAssigned = sequelize.define("ProgramAssigned", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  isComplete : {
    type : Sequelize.BOOLEAN,
    defaultValue : false
  }
});

module.exports = ProgramAssigned;
