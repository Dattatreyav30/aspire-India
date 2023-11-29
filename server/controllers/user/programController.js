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

//error handlers
const errorForJoi = require("../../helpers/error").errorHandlerJoi;
const error500 = require("../../helpers/error").error500;

const sequelize = require("../../util/database");
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
  try {
    const { departmentName } = req.body;
    const { error } = departmentSchema.validate(req.body);
    if (error) {
      errorForJoi(error);
    }

    // Check if the department already exists
    const existingDepartment = await Department.findOne({
      where: { departmentName: departmentName },
    });

    if (existingDepartment) {
      return res.status(400).json({ message: "Department already exists" });
    }

    let newDept = await Department.create({ departmentName });
    res
      .status(200)
      .json({ message: "Department created successfully", dept: newDept });
  } catch (err) {
    error500(err, res);
  }
};

exports.postSkills = async (req, res) => {
  try {
    const { skillName } = req.body;

    //validating with joi
    const { error } = skillSchema.validate(req.body);
    if (error) {
      errorForJoi(error);
    }

    // Check if the skill already exists
    const existingSkill = await Skills.findOne({ where: { skillName } });

    if (existingSkill) {
      return res.status(400).json({ message: "Skill already exists" });
    }

    let newSkill = await Skills.create({ skillName });
    res
      .status(200)
      .json({ message: "Skill created successfully", skill: newSkill });
  } catch (err) {
    error500(err, res);
  }
};

exports.postDesignation = async (req, res) => {
  try {
    const { designationName } = req.body;
    const { error } = designationSchema.validate(req.body);
    if (error) {
      errorForJoi(error);
    }
    // Check if the designation already exists
    const existingDesignation = await Designation.findOne({
      where: { designationName },
    });
    if (existingDesignation) {
      return res.status(400).json({ message: "Designation already exists" });
    }

    let newDesignation = await Designation.create({ designationName });
    res.status(200).json({
      message: "Designation created successfully",
      designation: newDesignation,
    });
  } catch (err) {
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
  try {
    const {
      programName,
      description,
      totalPoints,
      actions,
      departments,
      skills,
      designations,
      geometricShape,
    } = req.body;

    // Create the program
    const createProgram = await Program.create({
      programName,
      description,
      totalPoints,
    });

    // Filter and insert departments
    const validDepartments = await Department.findAll({
      where: { id: departments },
    });
    for (const department of validDepartments) {
      await ProgramDepartment.create({
        departmentId: department.id,
        programId: createProgram.id,
      });
    }

    // Filter and insert designations
    const validDesignations = await Designation.findAll({
      where: { id: designations },
    });
    for (const designation of validDesignations) {
      await ProgramDesignation.create({
        designationId: designation.id,
        programId: createProgram.id,
      });
    }

    // Filter and insert skills
    const validSkills = await Skills.findAll({ where: { id: skills } });
    for (const skill of validSkills) {
      await ProgramSkills.create({
        skillId: skill.id,
        programId: createProgram.id,
      });
    }

    // Insert actions
    for (const action of actions) {
      console.log(action);
      await Actions.create({
        name: action.name,
        description: action.description,
        points: action.points,
        duration: action.duration,
        programId: createProgram.id,
        geometricShape: action.geometricShape,
      });
    }

    res.status(200).json({ message: "program created successfully" });
  } catch (err) {
    console.log(err);
    error500(err, res);
  }
};

exports.postTeam = async (req, res) => {
  try {
    const { teamName, userIds } = req.body;
    //joi validation
    const { error } = postTeamSchema.validate(req.body);

    if (error) {
      errorForJoi(error, res);
    }
    // Add users to the team
    let newTeam = await Team.create({
      teamName,
    });

    const userNames = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "name"],
    });

    const userNamesMap = {};
    userNames.forEach((user) => {
      userNamesMap[user.id] = user.name;
    });

    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];
      const userName = userNamesMap[userId];
      await UserTeam.create({ userId, teamId: newTeam.id, userName });
    }
    res.status(200).json({ message: "Team created successfully" });
  } catch (err) {
    error500(err, res);
  }
};

exports.postProgramAssigned = async (req, res) => {
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
    });
    // If the assignment already exists, return a 409  response

    if (existingAssignment) {
      return res
        .status(409)
        .json({ error: "Program is already assigned to the team" });
    }
    const userIdsData = await UserTeam.findAll({
      where: { teamId: teamId },
      attributes: ["userId"],
    });

    const userIds = userIdsData.map((user) => user.userId);

    const actions = await Actions.findAll({ where: { programId: programId } });

    const actionDetails = actions.map((action) => {
      return {
        id: action.id,
        duration: action.duration,
        points: action.points,
      };
    });

    for (let i = 0; i < userIds.length; i++) {
      await UserPrograms.create({
        userId: userIds[i],
        programId: programId,
      });
    }

    for (let i = 0; i < userIds.length; i++) {
      await createUserActions(userIds[i], actionDetails, programId);
    }
    await ProgramAssigned.create({
      programId,
      teamId,
    });

    res.status(200).json({ message: "succesfull" });
  } catch (err) {
    error500(err, res);
  }
};

exports.postAction = async (req, res) => {
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
    });
    const action = await Actions.findOne({ where: { id: actionId } });
    // console.log(existingAction.frequency , "this is frequency")
    if (existingAction) {
      const today = new Date(); // Get today's date
      const createdAtDate = existingAction.createdAt; // Assuming createdAt is a Date object
      // Check if the dates match (ignoring time)
      if (
        today.getFullYear() === createdAtDate.getFullYear() &&
        today.getMonth() === createdAtDate.getMonth() &&
        today.getDate() === createdAtDate.getDate()
      ) {
        // Dates match, throw an error
        throw new Error("Action already completed today");
      }
    }

    //completing action if duration and frquency match
    let actionCompletion;
    const createActionCompletion = async () => {
      actionCompletion = await ActionCompletion.create({
        actionId,
        programId,
        userId: req.user,
        imageUrlS3: imageS3Response.Location,
        audioUrlS3: audioS3Response.Location,
        text,
        locationName,
        geometricShape: action.geometricShape,
      });
    };
    await createActionCompletion();
    await UserActions.update(
      { frequency: sequelize.literal("frequency + 1") },
      { where: { userId: req.user, actionId } }
    );
    const userAction = await UserActions.findOne({
      where: { userId: req.user, actionId },
    });

    // const [incrementedAction] = await UserActions.increment("frequency", {
    //   by: 1,
    //   where: {
    //     userId: req.user,
    //     actionId: actionId,
    //   },
    // });

    let askQuestionBoolean = false;
    let foundQn;
    const askFeedBackQn = async (frequency) => {
      foundQn = await feedbackQuestions.findOne({
        where: { day: frequency },
      });
      if (foundQn) {
        askQuestionBoolean = true;
      }
    };
    // res.status(200).json({updateFrequency,userAction})
    // Call askFeedBackQn function with the updated frequency
    await askFeedBackQn(userAction.frequency);
    //queried beacuse to check length of  user actions
    const userActions = await UserActions.findAll({
      where: { programId: programId, isComplete: false, userId: req.user },
    });

    //here checking whether all the actions are complted so that i can mark program is complete
    let actionCount = 0;
    for (let i = 0; i < userActions.length; i++) {
      if (userActions.isComplete === true) {
        actionCount++;
      }
    }
    if (actionCount === userActions.length) {
      UserPrograms.update(
        { isComplete: true },
        { where: { userId: req.user, programId } }
      );
    }
    if (Number(userAction.frequency) === Number(userAction.duration)) {
      await UserActions.update(
        { isComplete: true },
        {
          where: {
            actionId: userAction.actionId,
            userId: Number(req.user),
          },
        }
      );
    }
    const user = await User.findOne({ where: { id: req.user } });
    await user.update({
      totalPoints: Number(user.totalPoints) + Number(action.points),
      tower: Number(user.tower) + Number(1),
    });
    res.status(200).json({
      message: "successful",
      isFeedback: {
        askqn: askQuestionBoolean || null,
        questionId: foundQn,
        actionId: actionCompletion.actionId,
        programId: actionCompletion.programId,
        geometricShape: actionCompletion.geometricShape,
      },
    });
  } catch (err) {
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
exports.getUserActions = async (req, res) => {
  try {
    const userId = req.user;
    const allActionDetails = [];
    const userActions = await UserActions.findAll({
      where: { userId: userId, isComplete: false },
    });
    // Process each UserAction
    let validActions;
    await Promise.all(
      userActions.map(async (userAction) => {
        // console.log(userAction)
        const { actionId, frequency, duration, totalPoints } = userAction;

        // Fetch the Action details for the given actionId
        const actionDetails = await Actions.findByPk(actionId);

        if (actionDetails) {
          // Calculate habitscore
          const habitScore = (frequency / duration) * 100;
          console.log(habitScore, frequency, duration);
          // Calculate totalpoints earned
          const totalPointsEarned = duration * totalPoints;

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

          const actionCompletions = await ActionCompletion.findAll({
            where: {
              userId,
              actionId,
              createdAt: {
                [Op.gte]: startOfMonth,
                [Op.lte]: endOfMonth,
              },
            },
            attributes: ["actionId", "createdAt", "updatedAt"],
          });

          validActions = {
            actionDetails,
            actionId,
            habitScore,
            totalPointsEarned,
            pointsEarned,
            actionCompletions,
          };
          allActionDetails.push(validActions);
        }
      })
    );

    res.status(200).json({ userActions: allActionDetails });
  } catch (err) {
    error500(err, res);
  }
};
