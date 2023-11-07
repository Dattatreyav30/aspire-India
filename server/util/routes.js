const express = require("express");
const app = express();

const userRoute = require("../routes/User/userRoute");
const programRoute = require("../routes/User/programRoute");

const routeFunction = () => {
  app.use("/user", userRoute);
  app.use("/program", programRoute);
};

module.exports = {
  app,
  routeFunction,
};
