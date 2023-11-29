const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const customer  = sequelize.define('customer',{
    id : {
        type : Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement : true
    },
})
module.exports  = customer