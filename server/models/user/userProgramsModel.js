const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const userPrograms = sequelize.define("userprograms", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  isComplete : {
    type : Sequelize.INTEGER,
    defaultValue : false
  }
});


module.exports = userPrograms
