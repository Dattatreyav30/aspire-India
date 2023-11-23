const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const programDepartment = sequelize.define("programDepartment", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = programDepartment;
