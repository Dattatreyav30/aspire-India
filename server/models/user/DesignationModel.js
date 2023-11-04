const Sequelize = require("sequelize");
const sequelize = require("../../util/database");


const Designation = sequelize.define('designation',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      designationName : {
        type : Sequelize.STRING
      }
})

module.exports = Designation;