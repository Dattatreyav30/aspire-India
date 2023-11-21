const express = require("express");
const app = express();

const userRoute = require("../routes/User/userRoute");
const programRoute = require("../routes/User/programRoute");
const tinyHabitRoute = require("../routes/User/tinyHabitRoute");
const personalityRoute = require("../routes/User/personalityRoute");
const communityRoute = require("../routes/User/communityRoute");
const chatRoute = require("../routes/User/chatRoute");

const routeFunction = () => {
  app.use("/user", userRoute);
  app.use("/program", programRoute);
  app.use("/habit", tinyHabitRoute);
  app.use("/personality", personalityRoute);
  app.use("/community", communityRoute);
  app.use("/chat", chatRoute);
};

module.exports = {
  app,
  routeFunction,
};
