const User = require("../models/user/UserModel");

const tinyHabits = require("../models/user/TinyHabitsModel");
const tinyHabitsCompletion = require("../models/user/TinyHabitCompletionModel");

const personalityQuestions = require("../models/user/PersonalityQuestionModel");
const personalityQnRecModel = require("../models/user/PersonalityQnRecModel");
const personalityOutcomes = require("../models/user/PersonalityOutcomeModel");
const personalityResults = require("../models/user/PersonalityResultsModel");
const personalityOptions = require("../models/user/PersonalityQnOptionsModel");

const programs = require("../models/user/Programs");
const actions = require("../models/user/ActionsModel");
const ProgramAssigned = require("../models/user/ProgramAssignedModel");
const Team = require("../models/user/TeamModel");
const ActionCompletion = require("../models/user/ActionCompletion");

const CommunityPosts = require("../models/user/CommunityPostsModel");
const CommunityPostsLikes = require("../models/user/CommunityPostsLikesModel");
const CommunityPostsComnts = require("../models/user/CommunityPostsComntsModel");

const Department = require("../models/user/DepartmentModel");
const Skills = require("../models/user/SkillsModel");
const Designation = require("../models/user/DesignationModel");
const ProgramDesignation = require("../models/user/ProgramDesignationModel");
const ProgramSkills = require("../models/user/ProgramSkills");
const ProgramDepartment = require("../models/user/ProgramDepartmentModel");

const UserTeam = require("../models/user/userTeamModel");
const PrecuratedMessages = require("../Models/user/PrecuratedMessagesModel");
const Messages = require("../models/user/MessagesModel");

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

  // here linking with record model , so that can identify which question is answered by user
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

  //one team can have many users

  User.hasMany(Team);
  Team.belongsTo(User);

  //one program can have many actions
  programs.hasMany(actions);
  actions.belongsTo(programs);

  //assigning program go user
  programs.hasMany(ProgramAssigned);
  ProgramAssigned.belongsTo(programs);

  //which team is part of program
  Team.hasMany(ProgramAssigned);
  ProgramAssigned.belongsTo(Team);

  //completing action by user
  User.hasMany(ActionCompletion);
  ActionCompletion.belongsTo(User);

  //relating actionId so that we can identity which habit is completed
  actions.hasMany(ActionCompletion);
  ActionCompletion.belongsTo(actions);

  //adding programId so that we can identify which action is part of which program
  programs.hasMany(ActionCompletion);
  ActionCompletion.belongsTo(programs);

  //for each like , linking it to the post id
  CommunityPosts.hasMany(CommunityPostsLikes);
  CommunityPostsLikes.belongsTo(CommunityPosts);

  //for each comment, linking it to the post id
  CommunityPosts.hasMany(CommunityPostsComnts);
  CommunityPostsComnts.belongsTo(CommunityPosts);

  //linking each user with likes that they have given
  User.hasMany(CommunityPostsLikes);
  CommunityPostsLikes.belongsTo(User);

  //linking each user with comment that they have given
  User.hasMany(CommunityPostsComnts);
  CommunityPostsComnts.belongsTo(User);

  programs.hasMany(ProgramDesignation);
  ProgramDesignation.belongsTo(programs);

  programs.hasMany(ProgramSkills);
  ProgramSkills.belongsTo(programs);

  programs.hasMany(ProgramDepartment);
  ProgramDepartment.belongsTo(programs);

  Department.hasMany(ProgramDepartment);
  ProgramDepartment.belongsTo(Department);

  Skills.hasMany(ProgramSkills);
  ProgramSkills.belongsTo(Skills);

  Designation.hasMany(ProgramDesignation);
  ProgramDesignation.belongsTo(Designation);

  User.belongsToMany(Team, { through: UserTeam });
  Team.belongsToMany(User, { through: UserTeam });

  User.hasMany(Messages);
  Messages.belongsTo(User);

  Team.hasMany(Messages);
  Messages.belongsTo(Team);

  PrecuratedMessages.hasMany(Messages);
  Messages.belongsTo(PrecuratedMessages);
};

module.exports = relationships;
