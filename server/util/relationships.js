const User = require("../models/user/UserModel");
const tinyHabits = require("../models/user/TinyHabitsModel");
const tinyHabitsCompletion = require("../models/user/TinyHabitCompletionModel");
const personalityQuestions = require("../models/user/PersonalityQuestionModel");
const personalityQnRecModel = require("../models/user/PersonalityQnRecModel");
const personalityOutcomes = require("../models/user/PersonalityOutcomeModel");
const personalityResults = require("../models/user/PersonalityResultsModel");
const personalityOptions = require("../models/user/PersonalityQnOptions");

const relationships = () => {
  //user and tiny habits , many tiny habits can be completed by single user
  User.hasMany(tinyHabitsCompletion);
  tinyHabitsCompletion.belongsTo(User);

  //here adding tinyhabitsquestion id so that we can relate which user is complted which habit
  tinyHabits.hasMany(tinyHabitsCompletion);
  tinyHabitsCompletion.belongsTo(tinyHabits);

  //here linking userid so that each time user answered qn can be redcorded here
  User.hasMany(personalityQnRecModel);
  personalityQnRecModel.belongsTo(User);

  // here linking with record model , so that which question is answered by user
  personalityQuestions.hasMany(personalityQnRecModel);
  personalityQnRecModel.belongsTo(personalityQuestions);

  // one personality can have multiple options
  personalityQuestions.hasMany(personalityOptions);
  personalityOptions.belongsTo(personalityQuestions);

  //ading userid and personalityOutcomesId. here , we can relate personality outcomes with id
  User.hasMany(personalityResults);
  personalityResults.belongsTo(User);

  personalityOutcomes.hasMany(personalityResults);
  personalityResults.belongsTo(personalityOutcomes);
};

module.exports = relationships;
