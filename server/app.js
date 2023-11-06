const bodyParser = require("body-parser");

const cors = require("cors");

const { app, routeFunction } = require("./util/routes");

const sequelize = require("./util/database");
const relationships = require("./util/relationships");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// RELATIONSHIPS
relationships();

routeFunction();

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

module.exports = app;
