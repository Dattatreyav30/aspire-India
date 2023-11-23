const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const programDesignation = sequelize.define("programDesignation", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,   
  },
});

module.exports = programDesignation;