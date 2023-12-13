const Sequelize = require("sequelize");

const sequelize = new Sequelize("new-aspire", "root", "Mykoshi@3", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER_NAME,
//   process.env.DB_PASSWORD,
//   {
//     dialect: "mysql",
//     host: process.env.DB_ENDPOINT,
//     port: 3306,
//   }
// );