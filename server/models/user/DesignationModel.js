const Sequelize = require("sequelize");
const sequelize = require("../../util/database");
const { UUIDV4 } = require("sequelize"); // Import UUIDV4 from Sequelize

const Designation = sequelize.define("designation", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  designationName: {
    type: Sequelize.STRING,
  },
  uniqueId: {
    type: Sequelize.CHAR(36),
    defaultValue: UUIDV4,
    unique: true,
  },
});

module.exports = Designation;
