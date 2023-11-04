const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const Department = sequelize.define("department", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  departmentName: {
    type: Sequelize.STRING,
  },
});

module.exports = Department;
