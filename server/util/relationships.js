//user
const User = require("../models/user/userModel");
const UserActions = require("../models/user/userActionsModel");

//tinyhabits
const tinyHabits = require("../models/user/tinyHabitsModel");
const tinyHabitsCompletion = require("../models/user/tinyHabitCompletionModel");

//personality
const personalityQuestions = require("../models/user/personalityQuestionModel");
const personalityQnRecModel = require("../models/user/personalityQnRecModel");
const personalityOutcomes = require("../models/user/personalityOutcomeModel");
const personalityResults = require("../models/user/personalityResultsModel");
const personalityOptions = require("../models/user/personalityQnOptionsModel");
const personalityOutcomesRecord = require("../models/user/personalityOutcomeRecModel");
const personalityLogicJump = require("../models/user/personalityLogicJump");

//programs
const programs = require("../models/user/programs");
const actions = require("../models/user/actionsModel");
const ProgramAssigned = require("../models/user/programAssignedModel");
const Team = require("../models/user/teamModel");
const ActionCompletion = require("../models/user/actionCompletion");

//community posts
const CommunityPosts = require("../models/user/communityPostsModel");
const CommunityPostsLikes = require("../models/user/communityPostsLikesModel");
const CommunityPostsComnts = require("../models/user/communityPostsComntsModel");

//programs department  designation
const Department = require("../models/user/departmentModel");
const Skills = require("../models/user/skillsModel");
const Designation = require("../models/user/designationModel");
const ProgramDesignation = require("../models/user/programDesignationModel");
const ProgramSkills = require("../models/user/programSkills");
const ProgramDepartment = require("../models/user/programDepartmentModel");

//teamchat
const UserTeam = require("../models/user/userTeamModel");
const PrecuratedMessages = require("../models/user/precuratedMessagesModel");
const Messages = require("../models/user/messagesModel");
const UserPrograms = require("../models/user/userProgramsModel");
const Actions = require("../models/user/actionsModel");

//feedback
const feedbackQuestions = require("../models/user/feedbackquestionsModel");
const feedbackOptions = require("../models/user/feedbackOptionsModel");
const userFeedback = require("../models/user/userFeedback");

//customer
const Customer = require("../models/customer/customerModel");
const otpModel = require("../models/user/otpModel");
const followersModel = require("../models/user/followersModel");
const followerReqModel = require("../models/user/followerReqModel");
const Streaks = require("../models/user/streaksModel");
const userTower = require("../models/user/userTower");
const towerShapes = require("../models/user/towerShape");

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

  //linking optionId to record model
  // personalityQnRecModel.hasMany(personalityOptions);
  // personalityOptions.belongsTo(personalityQnRecModel);

  User.hasMany(personalityOutcomesRecord);
  personalityOutcomesRecord.belongsTo(User);

  personalityOutcomes.hasMany(personalityOutcomesRecord);
  personalityOutcomesRecord.belongsTo(personalityOutcomes);

  //ading userid and personalityOutcomesId. here , we can relate personality outcomes with id
  User.hasMany(personalityResults);
  personalityResults.belongsTo(User);

  personalityOutcomes.hasMany(personalityResults);
  personalityResults.belongsTo(personalityOutcomes);

  // personality logic jump relations
  // personalityLogicJump.belongsTo(personalityOptions, {
  //   as: "fromOptions",
  //   foreignKey: "from_option_id",
  // });
  personalityLogicJump.belongsTo(personalityQuestions, {
    as: "toQuestion",
    foreignKey: "to_question_id",
  });
  personalityLogicJump.belongsTo(personalityOptions, {
    as: "option",
    foreignKey: "option_id",
  });

  personalityOptions.hasMany(personalityQnRecModel); // One-to-many relationship
  personalityQnRecModel.belongsTo(personalityOptions); // Belongs to PersonalityOptions

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

  User.hasMany(UserPrograms);
  UserPrograms.belongsTo(User);

  programs.hasMany(UserPrograms);
  UserPrograms.belongsTo(programs);

  //adding programId so that we can identify which action is part of which program
  programs.hasMany(ActionCompletion);
  ActionCompletion.belongsTo(programs);

  //relating userid with community posts
  User.hasMany(CommunityPosts);
  CommunityPosts.belongsTo(User);

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

  programs.hasMany(UserActions);
  UserActions.belongsTo(programs);

  Actions.hasMany(UserActions);
  UserActions.belongsTo(Actions);

  User.hasMany(UserActions);
  UserActions.belongsTo(User);

  //one program  can be part of many designations
  programs.hasMany(ProgramDesignation);
  ProgramDesignation.belongsTo(programs);

  //one program  can be part of many skills
  programs.hasMany(ProgramSkills);
  ProgramSkills.belongsTo(programs);

  //one program  can be part of many departments
  programs.hasMany(ProgramDepartment);
  ProgramDepartment.belongsTo(programs);

  //linking department with program to identify which are all the programs are linked with which department
  Department.hasMany(ProgramDepartment);
  ProgramDepartment.belongsTo(Department);

  //linking skills with program to identify which are all the programs are linked with which skills
  Skills.hasMany(ProgramSkills);
  ProgramSkills.belongsTo(Skills);

  //linking designation with program to identify which are all the programs are linked with which designation
  Designation.hasMany(ProgramDesignation);
  ProgramDesignation.belongsTo(Designation);

  //user can be part of many team,
  User.belongsToMany(Team, { through: UserTeam });
  Team.belongsToMany(User, { through: UserTeam });

  //one user can have many messages
  User.hasMany(Messages);
  Messages.belongsTo(User);

  //one team can have many messages
  Team.hasMany(Messages);
  Messages.belongsTo(Team);

  //linking precurated messages to messages table , here we can identify which message is part of precurated messages
  PrecuratedMessages.hasMany(Messages);
  Messages.belongsTo(PrecuratedMessages);

  //feedback relationships
  feedbackQuestions.hasMany(feedbackOptions);
  feedbackOptions.belongsTo(feedbackQuestions);

  User.hasMany(userFeedback);
  userFeedback.belongsTo(User);

  feedbackOptions.hasMany(userFeedback);
  userFeedback.belongsTo(feedbackOptions);

  feedbackQuestions.hasMany(userFeedback);
  userFeedback.belongsTo(feedbackQuestions);

  Actions.hasMany(userFeedback);
  userFeedback.belongsTo(Actions);

  programs.hasMany(userFeedback);
  userFeedback.belongsTo(programs);

  //otp and user
  User.hasMany(otpModel);
  otpModel.belongsTo(User);

  //followers
  User.hasMany(followersModel);
  followersModel.belongsTo(User);

  followersModel.belongsTo(User, {
    as: "follower",
    foreignKey: "follower_id",
  });

  followerReqModel.belongsTo(User, {
    as: "followeRequester",
    foreignKey: "requesterId",
  });

  followerReqModel.belongsTo(User, {
    as: "followeRequesteee",
    foreignKey: "requesteeId",
  });

  //straks and user
  User.hasMany(Streaks);
  Streaks.belongsTo(User);

  //tower and user

  User.hasMany(userTower);
  userTower.belongsTo(User);

  Actions.hasMany(userTower);
  userTower.belongsTo(Actions);

  towerShapes.hasMany(userTower);
  userTower.belongsTo(towerShapes);

  programs.hasMany(userTower);
  userTower.belongsTo(programs);
  //customer realtionships................................................

  //relating customer with user
};

module.exports = relationships;
