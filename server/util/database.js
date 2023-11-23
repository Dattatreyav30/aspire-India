const Sequelize = require("sequelize");
require('dotenv').config()
const sequelize = new Sequelize("aspireIndia", "root", "Mykoshi@3", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
