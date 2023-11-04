const Sequelize = require("sequelize");
const sequelize = require("../../util/database");

const UserTeam = sequelize.define('userTeam',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
})

module.exports = UserTeam
