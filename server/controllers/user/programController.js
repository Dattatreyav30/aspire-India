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
      await Actions.create({
        name: action.name,
        description: action.description,
        points: action.points,
        duration: action.duration,
        programId: createProgram.id,
      });
    }

    res.status(200).json({ message: "program created successfully" });
  } catch (err) {
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

exports.postProgramAssigned = async (req, res, next) => {
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

    const actionIds = actions.map((action) => action.id);

    for (let i = 0; i < userIds.length; i++) {
      await UserPrograms.create({
        userId: userIds[i],
        programId: programId,
      });
      await createUserActions(userIds[i], actionIds[i], programId);
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

    const action = await Actions.findOne({ where: { id: actionId } });

    //completing action if duration and frquency match
    if (existingAction) {
      if (Number(existingAction.frequency) === Number(action.duration)) {
        await UserActions.update(
          { isComplete: true },
          { where: { actionId: actionId } }
        );
      }
    }

    let actionCompletion;
    const createActionCompletion = async (frequency) => {
      actionCompletion = await ActionCompletion.create({
        actionId,
        programId,
        userId: req.user,
        imageUrlS3: imageS3Response.Location,
        audioUrlS3: audioS3Response.Location,
        text,
        locationName,
        frequency,
        duration: action.duration,
      });
    };

    let askQuestionBoolean = false;
    const askFeedBackQn = async (frequency) => {
      const fondQn = await feedbackQuestions.findOne({
        where: { day: frequency },
      });
      if (fondQn) {
        askQuestionBoolean = true;
      }
    };

    if (existingAction) {
      // If existing action found, update the frequency
      const updatedFrequency = Math.floor(existingAction.frequency) + 1;
      await createActionCompletion(updatedFrequency);
      await askFeedBackQn(updatedFrequency);
    } else {
      // If no existing action found, create a new record with frequency: 1
      await createActionCompletion(1);
      await askFeedBackQn(1);
    }

    const user = await User.findOne({ where: { id: req.user } });
    await user.update({
      totalPoints: Number(user.totalPoints) + Number(action.points),
      tower: Number(user.tower) + Number(1),
    });

    console.log(createActionCompletion.actionId);
    console.log(createActionCompletion.programId);
    res.status(200).json({
      message: "successful",
      isFeedback: {
        askqn: askQuestionBoolean,
        actionId: actionCompletion.actionId,
        programId: actionCompletion.programId,
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
