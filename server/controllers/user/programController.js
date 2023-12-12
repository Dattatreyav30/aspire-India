//models
const Program = require("../../models/user/programs");
const Actions = require("../../models/user/actionsModel");
const Designation = require("../../models/user/designationModel");
const Department = require("../../models/user/departmentModel");
const Skills = require("../../models/user/skillsModel");
const ProgramDesignation = require("../../models/user/programDesignationModel");
const ProgramDepartment = require("../../models/user/programDepartmentModel");
const ProgramSkills = require("../../models/user/programSkills");
const Team = require("../../models/user/teamModel");
const UserTeam = require("../../models/user/userTeamModel");
const ProgramAssigned = require("../../models/user/programAssignedModel");
const ActionCompletion = require("../../models/user/actionCompletion");
const User = require("../../models/user/userModel");
const UserPrograms = require("../../models/user/userProgramsModel");
const feedbackQuestions = require("../../models/user/feedbackquestionsModel");
const towerShapes = require("../../models/user/towerShape");
const userTower = require("../../models/user/userTower");

//error handlers
const errorForJoi = require("../../helpers/error").errorHandlerJoi;
const error500 = require("../../helpers/error").error500;

const sequelize = require("../../util/database");
const Sequelize = require("sequelize");
//functions
const {
  getUser,
  getProgramData,
  getUserProgramIds,
  s3,
  s3ImageParams,
  s3AudioParams,
  createUserActions,
} = require("../../helpers/controllerFunctions");
const UserActions = require("../../models/user/userActionsModel");

const { Op, or } = require("sequelize");
const Streaks = require("../../models/user/streaksModel");

//joiSchemas
const departmentSchema = require("../../helpers/validation").departmentSchema;
const skillSchema = require("../../helpers/validation").skillSchema;
const designationSchema = require("../../helpers/validation").designationSchema;
const postTeamSchema = require("../../helpers/validation").postTeamSchema;
const postProgramAssignedSchema =
  require("../../helpers/validation").postProgramAssignedSchema;
// const postActionValidationSchema =
//   require("../../helpers/validation").postActionValidationSchema;

//adding up the department
exports.postDepartment = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { departmentName } = req.body;
    const { error } = departmentSchema.validate(req.body);

    if (error) {
      return errorForJoi(error);
    }

    const existingDepartment = await Department.findOne({
      where: { departmentName },
      transaction: t,
    });

    if (existingDepartment) {
      await t.rollback();
      return res.status(400).json({ message: "Department already exists" });
    }

    let newDept = await Department.create(
      { departmentName },
      { transaction: t }
    );
    await t.commit();
    res
      .status(200)
      .json({ message: "Department created successfully", dept: newDept });
  } catch (err) {
    await t.rollback();
    error500(err, res);
  }
};

exports.postSkills = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { skillName } = req.body;
    const { error } = skillSchema.validate(req.body);

    if (error) {
      return errorForJoi(error);
    }

    const existingSkill = await Skills.findOne({
      where: { skillName },
      transaction: t,
    });

    if (existingSkill) {
      await t.rollback();
      return res.status(400).json({ message: "Skill already exists" });
    }

    let newSkill = await Skills.create({ skillName }, { transaction: t });
    await t.commit();
    res
      .status(200)
      .json({ message: "Skill created successfully", skill: newSkill });
  } catch (err) {
    await t.rollback();
    error500(err, res);
  }
};

exports.postDesignation = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { designationName } = req.body;
    const { error } = designationSchema.validate(req.body);

    if (error) {
      return errorForJoi(error);
    }

    const existingDesignation = await Designation.findOne({
      where: { designationName },
      transaction: t,
    });

    if (existingDesignation) {
      await t.rollback();
      return res.status(400).json({ message: "Designation already exists" });
    }

    let newDesignation = await Designation.create(
      { designationName },
      { transaction: t }
    );
    await t.commit();
    res.status(200).json({
      message: "Designation created successfully",
      designation: newDesignation,
    });
  } catch (err) {
    await t.rollback();
    error500(err, res);
  }
};

exports.getDeptSkillsDesgntn = async (req, res) => {
  try {
    const allDesignations = await Designation.findAll();

    const allSkills = await Skills.findAll();

    const allDepartments = await Department.findAll();

    res.status(200).json({
      designations: allDesignations,
      skills: allSkills,
      departments: allDepartments,
    });
  } catch (err) {
    error500(err, res);
  }
};

exports.postProgramWithActions = async (req, res) => {
  const t = await sequelize.transaction(); // Start a transaction

  try {
    const {
      programName,
      description,
      totalPoints,
      actions,
      departments,
      skills,
      designations,
    } = req.body;

    // Create the program within the transaction
    const createProgram = await Program.create(
      {
        programName,
        description,
        totalPoints,
      },
      { transaction: t }
    );

    // Filter and insert departments within the transaction
    const validDepartments = await Department.findAll({
      where: { id: departments },
      transaction: t,
    });
    for (const department of validDepartments) {
      await ProgramDepartment.create(
        {
          departmentId: department.id,
          programId: createProgram.id,
        },
        { transaction: t }
      );
    }

    // Filter and insert designations within the transaction
    const validDesignations = await Designation.findAll({
      where: { id: designations },
      transaction: t,
    });
    for (const designation of validDesignations) {
      await ProgramDesignation.create(
        {
          designationId: designation.id,
          programId: createProgram.id,
        },
        { transaction: t }
      );
    }

    // Filter and insert skills within the transaction
    const validSkills = await Skills.findAll({
      where: { id: skills },
      transaction: t,
    });
    for (const skill of validSkills) {
      await ProgramSkills.create(
        {
          skillId: skill.id,
          programId: createProgram.id,
        },
        { transaction: t }
      );
    }

    // Insert actions within the transaction
    for (const action of actions) {
      await Actions.create(
        {
          name: action.name,
          description: action.description,
          points: action.points,
          duration: action.duration,
          programId: createProgram.id,
          actionType: action.actionType,
        },
        { transaction: t }
      );
    }

    await t.commit(); // Commit the transaction
    res.status(200).json({ message: "program created successfully" });
  } catch (err) {
    await t.rollback(); // Rollback transaction on error
    console.log(err);
    error500(err, res);
  }
};

exports.postTeam = async (req, res) => {
  const t = await sequelize.transaction(); // Start a transaction

  try {
    const { teamName, userIds } = req.body;

    const { error } = postTeamSchema.validate(req.body);

    if (error) {
      errorForJoi(error, res);
    }

    let newTeam = await Team.create(
      {
        teamName,
      },
      { transaction: t }
    );

    const userNames = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "name"],
      transaction: t,
    });

    const userNamesMap = {};
    userNames.forEach((user) => {
      userNamesMap[user.id] = user.name;
    });

    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];
      const userName = userNamesMap[userId];
      await UserTeam.create(
        { userId, teamId: newTeam.id, userName },
        { transaction: t }
      );
    }

    await t.commit();
    res.status(200).json({ message: "Team created successfully" });
  } catch (err) {
    await t.rollback();
    error500(err, res);
  }
};

exports.postProgramAssigned = async (req, res) => {
  const t = await sequelize.transaction(); // Start a transaction

  try {
    const { programId, teamId } = req.body;
    const { error } = postProgramAssignedSchema.validate(req.body);

    if (error) {
      errorForJoi(error, res);
    }

    const existingAssignment = await ProgramAssigned.findOne({
      where: {
        programId: programId,
        teamId: teamId,
      },
      transaction: t,
    });

    if (existingAssignment) {
      await t.rollback(); // Rollback transaction if assignment exists
      return res
        .status(409)
        .json({ error: "Program is already assigned to the team" });
    }

    const userIdsData = await UserTeam.findAll({
      where: { teamId: teamId },
      attributes: ["userId"],
      transaction: t,
    });

    const userIds = userIdsData.map((user) => user.userId);

    const actions = await Actions.findAll({
      where: { programId: programId },
      transaction: t,
    });

    const actionDetails = actions.map((action) => {
      return {
        id: action.id,
        duration: action.duration,
        points: action.points,
      };
    });

    for (let i = 0; i < userIds.length; i++) {
      await UserPrograms.create(
        {
          userId: userIds[i],
          programId: programId,
        },
        { transaction: t }
      );
    }

    for (let i = 0; i < userIds.length; i++) {
      await createUserActions(userIds[i], actionDetails, programId, t);
    }

    await ProgramAssigned.create(
      {
        programId,
        teamId,
      },
      { transaction: t }
    );

    await t.commit(); // Commit the transaction
    res.status(200).json({ message: "succesfull" });
  } catch (err) {
    await t.rollback(); // Rollback transaction on error
    error500(err, res);
  }
};

exports.postAction = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const imageFile = req.files["image"][0];
    const audioFile = req.files["audio"][0];

    const imageParams = s3ImageParams(imageFile, "uploads/images/");
    const imageS3Response = await s3.upload(imageParams).promise();

    const audioParams = s3AudioParams(audioFile, "uploads/audio/");
    const audioS3Response = await s3.upload(audioParams).promise();

    const { text, locationName, actionId, programId } = req.body;

    const existingAction = await ActionCompletion.findOne({
      where: {
        userId: req.user,
        actionId: actionId,
      },
      order: [["createdAt", "DESC"]],
      transaction: t,
    });

    const action = await Actions.findOne({
      where: { id: actionId },
      transaction: t,
    });

    //if action is already completed today , user cant complete another action

    if (existingAction) {
      const today = new Date();
      const createdAtDate = existingAction.createdAt;
      if (
        today.getFullYear() === createdAtDate.getFullYear() &&
        today.getMonth() === createdAtDate.getMonth() &&
        today.getDate() === createdAtDate.getDate()
      ) {
        throw new Error("Action already completed today");
      }
    }

    let actionCompletion;
    const createActionCompletion = async () => {
      actionCompletion = await ActionCompletion.create(
        {
          actionId,
          programId,
          userId: req.user,
          imageUrlS3: imageS3Response.Location,
          audioUrlS3: audioS3Response.Location,
          text,
          locationName,
        },
        { transaction: t }
      );
    };
    await createActionCompletion();

    //increasing the frequency in useractkon table on completion each of habit

    await UserActions.update(
      { frequency: sequelize.literal("frequency + 1") },
      { where: { userId: req.user, actionId }, transaction: t }
    );

    const userAction = await UserActions.findOne({
      where: { userId: req.user, actionId },
      transaction: t,
    });

    let askQuestionBoolean = false;
    let foundQn;

    //checking if feedback question day feild matches freqnecy and if matches will send them  feedback questions

    const askFeedBackQn = async (frequency) => {
      foundQn = await feedbackQuestions.findOne({
        where: { day: frequency },
        transaction: t,
      });
      if (foundQn) {
        askQuestionBoolean = true;
      }
    };

    await askFeedBackQn(userAction.frequency);

    const userActions = await UserActions.findAll({
      where: { programId: programId, isComplete: false, userId: req.user },
      transaction: t,
    });

    let actionCount = 0;
    for (let i = 0; i < userActions.length; i++) {
      if (userActions.isComplete === true) {
        actionCount++;
      }
    }

    //if all the actions is completed , marking the program is complete

    if (actionCount === userActions.length) {
      await UserPrograms.update(
        { isComplete: true },
        { where: { userId: req.user, programId }, transaction: t }
      );
    }

    //if frequency and duration are equal, marking the action is complete

    if (Number(userAction.frequency) === Number(userAction.duration)) {
      await UserActions.update(
        { isComplete: true },
        {
          where: {
            actionId: userAction.actionId,
            userId: Number(req.user),
          },
          transaction: t,
        }
      );
    }

    const user = await User.findOne({
      where: { id: req.user },
      transaction: t,
    });

    //updating total number of points

    await user.update(
      {
        totalPoints: Number(user.totalPoints) + Number(action.points),
        tower: Number(user.tower) + Number(1),
      },
      { transaction: t }
    );

    await t.commit();
    res.status(200).json({
      message: "successful",
      isFeedback: {
        askqn: askQuestionBoolean || null,
        questionId: foundQn,
        actionId: actionCompletion.actionId,
        programId: actionCompletion.programId,
      },
    });
  } catch (err) {
    await t.rollback();
    console.log(err);
    error500(err, res);
  }
};

exports.getHome = async (req, res) => {
  try {
    const userId = req.user;

    const user = await getUser(userId);
    const programIds = await getUserProgramIds(userId);
    const programData = await getProgramData(programIds, userId);

    res.status(200).json({ user, programData });
  } catch (err) {
    error500(err, res);
  }
};

exports.getUserPrograms = async (req, res) => {
  try {
    const userId = req.user;
    const userPrograms = await UserPrograms.findAll({
      where: { userId, isComplete: false },
    });
    const programIds = userPrograms.map((program) => program.programId);
    const programTeamDetails = await ProgramAssigned.findAll({
      where: { programId: programIds },
      attributes: ["programId", "teamId"],
    });
    let programs = [];
    for (let i = 0; i < programTeamDetails.length; i++) {
      const { programId, teamId } = programTeamDetails[i];

      const programDetails = await Program.findOne({
        where: { id: programId },
      });
      const teamDetails = await UserTeam.findOne({ where: { id: teamId } });

      if (programDetails && teamDetails) {
        const linkedProgram = {
          program: programDetails,
          team: teamDetails,
        };
        programs.push(linkedProgram);
      }
    }
    res.status(200).json({ message: "successful", teamPrograms: programs });
  } catch (err) {
    console.log(err);
    error500(err, res);
  }
};
// exports.getUserActions = async (req, res) => {
//   try {
//     const userId = req.user;
//     const allActionDetails = [];
//     const userActions = await UserActions.findAll({
//       where: { userId: userId, isComplete: false },
//     });
//     // Process each UserAction
//     let validActions;
//     await Promise.all(
//       userActions.map(async (userAction) => {
//         // console.log(userAction)
//         const { actionId, frequency, duration, totalPoints } = userAction;

//         // Fetch the Action details for the given actionId
//         const actionDetails = await Actions.findByPk(actionId);

//         if (actionDetails) {
//           // Calculate habitscore
//           const habitScore = (frequency / duration) * 100;
//           // console.log(habitScore, frequency, duration);
//           // Calculate totalpoints earned
//           const totalpoints= duration * totalPoints;

//           // Calculate points earned
//           const pointsEarned = frequency * duration;
//           const currentDate = new Date();
//           const startOfMonth = new Date(
//             currentDate.getFullYear(),
//             currentDate.getMonth(),
//             1
//           );
//           const endOfMonth = new Date(
//             currentDate.getFullYear(),
//             currentDate.getMonth() + 1,
//             0
//           );

//           const actionCompletions = await ActionCompletion.findAll({
//             where: {
//               userId,
//               actionId,
//               createdAt: {
//                 [Op.gte]: startOfMonth,
//                 [Op.lte]: endOfMonth,
//               },
//             },
//             attributes: ["actionId", "createdAt", "updatedAt"],
//           });

//           validActions = {
//             actionDetails,
//             actionId,
//             habitScore,
//             totalpoints,
//             pointsEarned,
//             actionCompletions,
//           };
//           allActionDetails.push(validActions);
//         }
//       })
//     );

//     res.status(200).json({ userActions: allActionDetails });
//   } catch (err) {
//     error500(err, res);
//   }
// };

exports.getUserActions = async (req, res) => {
  try {
    const userId = req.user;
    console.log(userId);
    const programId = req.params.programId;
    const userActions = await UserActions.findAll({
      where: { programId: programId, userId: userId, isComplete: false },
    });
    const allActionDetails = [];

    await Promise.all(
      userActions.map(async (userAction) => {
        // console.log(userAction)
        const { actionId, frequency, duration, totalPoints } = userAction;
        // Fetch the Action details for the given actionId
        const actionDetails = await Actions.findByPk(actionId);
        if (actionDetails) {
          // Calculate habitscore
          const habitScore = (frequency / duration) * 100;
          // console.log(habitScore, frequency, duration);
          // Calculate totalpoints earned
          const totalpoints = duration * totalPoints;

          // Calculate points earned
          const pointsEarned = frequency * duration;
          const currentDate = new Date();
          const startOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          );
          const endOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
          );
          console.log(userId, actionId, programId);
          const actionCompletions = await ActionCompletion.findAll({
            where: {
              userId,
              actionId,
              programId,
              // createdAt: {
              //   [Op.gte]: startOfMonth,
              //   [Op.lte]: endOfMonth,
              // },
            },
            attributes: ["actionId", "createdAt", "updatedAt"],
          });

          validActions = {
            actionDetails,
            actionId,
            habitScore,
            totalpoints,
            pointsEarned,
            actionCompletions,
          };
          allActionDetails.push(validActions);
        }
      })
    );

    res.status(200).json({ userActions: allActionDetails });
  } catch (err) {
    console.log(err);
    error500(err, res);
  }
};

exports.streaksCalculation = async (req, res) => {
  try {
    const userId = req.user;
    console.log(userId);
    const streaks = {
      dailyStreak: "",
      weeklyStreak: "",
      monthlyStreak: "",
    };
    async function calculateDailyStreak(userId) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const actionCountToday = await ActionCompletion.count({
        where: {
          userId: userId,
          createdAt: {
            [Sequelize.Op.between]: [yesterday, today], // Actions(habits) from yesterday and today
          },
        },
      });
      streaks.dailyStreak = actionCountToday || 0;
    }
    async function calculateWeeklyStreak(userId) {
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);

      const actionCountLastWeek = await ActionCompletion.count({
        where: {
          userId: userId,
          createdAt: {
            [Sequelize.Op.between]: [lastWeek, today], // Actions from last week until today
          },
        },
      });

      streaks.weeklyStreak = actionCountLastWeek || 0;
    }
    async function calculateMonthlyStreak(userId) {
      const today = new Date();
      const lastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate()
      );

      const actionCountLastMonth = await ActionCompletion.count({
        where: {
          userId: userId,
          createdAt: {
            [Sequelize.Op.between]: [lastMonth, today], // Actions from last month until today
          },
        },
      });

      streaks.monthlyStreak = actionCountLastMonth || 0;
    }
    const findUserStreak = await Streaks.findOne({ where: { userId } });
    await calculateDailyStreak(userId);
    await calculateWeeklyStreak(userId);
    await calculateMonthlyStreak(userId);
    if (
      Number(findUserStreak.monthlyStreak) - Number(streaks.monthlyStreak) >=
      3
    ) {
      await Streaks.update(
        {
          weeklyStreak: 0,
          monthlyStreak: 0,
        },
        { where: { userId: userId } }
      );
    } else {
      await Streaks.update(
        {
          dailyStreak: streaks.dailyStreak,
          weeklyStreak: streaks.weeklyStreak,
          monthlyStreak: streaks.monthlyStreak,
        },
        { where: { userId } }
      );
    }
    const updatedStreak = await Streaks.findOne({ where: { userId } });
    res.status(200).json({ updatedStreak });
  } catch (err) {
    error500(err, res);
  }
};

exports.addShapetoTower = async (req, res) => {
  try {
    const { towershapeId, actionId } = req.body;
    const userId = req.user;
    const towerShape = await towerShapes.findOne({
      where: { id: towershapeId },
    });

    await userTower.create({
      towershapeId,
      actionId,
      userId: userId,
      shapeType: towerShape.shapeType,
    });
    res.status(200).json({ message: "user tower data is updating" });
  } catch (err) {
    error500(err, res);
  }
};
exports.storeShapes = async (req, res) => {
  try {
    const { shapeUrl, shapeType } = req.body;
    await towerShapes.create({
      shapeUrl,
      shapeType,
    });
    res.status(200).json({ message: "shapes created succesfully" });
  } catch (err) {
    error500(err, res);
  }
};

exports.getShapes = async (req, res) => {
  try {
    const allShapes = await towerShapes.findAll();
    res.status(200).json({ allShapes });
  } catch (err) {
    error500(err, res);
  }
};


//doubts
//
exports.getAllUserTowerData = async (req, res) => {
  try {
    const userId = req.user;
    
  } catch (err) {
    error500(err, res);
  }
};
