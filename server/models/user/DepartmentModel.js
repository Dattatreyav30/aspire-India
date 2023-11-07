const Sequelize = require("sequelize");
const sequelize = require("../../util/database");
const { UUIDV4 } = require("sequelize"); // Import UUIDV4 from Sequelize

const Department = sequelize.define("department", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  departmentName: {
    type: Sequelize.STRING,
  },
  uniqueId: {
    type: Sequelize.CHAR(36),
    defaultValue: UUIDV4,
    unique: true,
  },
});

module.exports = Department;
