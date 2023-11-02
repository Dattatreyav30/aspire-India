const express = require("express");

const bodyParser = require("body-parser");

const cors = require("cors");

const app = express();

const sequelize = require("./util/database");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//models
const User = require("./models/user/userModel");
const tinyHabits = require("./models/user/tinyHabitsModel");
const tinyHabitsCompletion = require("./models/user/tinyHabitCompletionModel");
const personalityQuestions = require("./models/user/personalityQuestionModel");
const personalityQnRecModel = require("./models/user/personalityQnRecModel");
const personalityOutcomes = require("./models/user/personalityOutcomeModel");

// RELATIONSHIPS

//user and tiny habits
User.hasMany(tinyHabitsCompletion);
tinyHabitsCompletion.belongsTo(User);

tinyHabits.hasMany(tinyHabitsCompletion);
tinyHabitsCompletion.belongsTo(tinyHabits);

//user and personality

User.hasMany(personalityOutcomes);
personalityOutcomes.belongsTo(User);

personalityQuestions.hasMany(personalityOutcomes);
personalityOutcomes.belongsTo(personalityQuestions);

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
