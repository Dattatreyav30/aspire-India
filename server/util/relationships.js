const User = require("../models/user/userModel");
const tinyHabits = require("../models/user/tinyHabitsModel");
const tinyHabitsCompletion = require("../models/user/tinyHabitCompletionModel");
const personalityQuestions = require("../models/user/personalityQuestionModel");
const personalityQnRecModel = require("../models/user/personalityQnRecModel");
const personalityOutcomes = require("../models/user/personalityOutcomeModel");
const personalityResults = require("../models/user/personalityResultsModel");
const personalityOptions = require("../models/user/personalityQnOptions")

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
