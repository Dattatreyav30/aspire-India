const express = require("express");

const bodyParser = require("body-parser");

const cors = require("cors");

const User = require("./models/user/userModel");

const app = express();

const sequelize = require("./util/database");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(User);

sequelize
  .sync()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
