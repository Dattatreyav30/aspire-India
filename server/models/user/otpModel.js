const Sequelize = require("sequelize");
const sequelize = require("../../util/database");
const { UUIDV4 } = require("sequelize"); // Import UUIDV4 from Sequelize

const otpModel = sequelize.define('otpModel',{
    otpId : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    otpCode : {
        type : Sequelize.INTEGER,
        allowNull : false,
    }
})

module.exports = otpModel