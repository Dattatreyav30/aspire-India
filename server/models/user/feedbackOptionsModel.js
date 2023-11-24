const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const feedbackOptions= sequelize.define('feedbackOptions',{
    id :{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    option:{
        type : Sequelize.STRING,
        allowNull :false
    }
})

module.exports = feedbackOptions