const express = require("express");
const app = express();

const userRoute = require("../routes/User/userRoute");

const routeFunction = () => {
  app.use("/user", userRoute);
};

module.exports = {
  app,
  routeFunction,
};
