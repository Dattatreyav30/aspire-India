//models
const Program = require("../../models/user/Programs");
const Actions = require("../../models/user/ActionsModel");
const Designation = require("../../models/user/DesignationModel");
const Department = require("../../models/user/DepartmentModel");
const Skills = require("../../models/user/SkillsModel");
const ProgramDesignation = require("../../models/user/ProgramDesignationModel");
const ProgramDepartment = require("../../models/user/ProgramDepartmentModel");
const ProgramSkills = require("../../models/user/ProgramSkills");
const Team = require("../../models/user/TeamModel");
const UserTeam = require("../../models/user/userTeamModel");
const ProgramAssigned = require("../../models/user/ProgramAssignedModel");
const ActionCompletion = require("../../models/user/ActionCompletion");
const User = require("../../models/user/UserModel");

//error handlers
const errorForJoi = require("../../helpers/error").errorHandlerJoi;
const error500 = require("../../helpers/error").error500;

//joiSchemas
const departmentSchema = require("../../helpers/validation").departmentSchema;
const skillSchema = require("../../helpers/validation").skillSchema;
const designationSchema = require("../../helpers/validation").designationSchema;
const postTeamSchema = require("../../helpers/validation").postTeamSchema;
const postProgramAssignedSchema =
  require("../../helpers/validation").postProgramAssignedSchema;
const postActionValidationSchema =
  require("../../helpers/validation").postActionValidationSchema;

const fs = require("fs");
const AWS = require("aws-sdk");
const multer = require("multer");
const UserActions = require("../../models/user/UserActionsModel");

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
    console.error(err);
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
    for (let i = 0; i < userIds.length; i++) {
      await UserTeam.create({ userId: userIds[i], teamId: newTeam.id });
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
      programId: programId,
      teamId: teamId,
    });

    // If the assignment already exists, return a 409 Conflict response

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

    for (let i = 0; i < userIds.length; i++) {
      await UserActions.create({
        userId: userIds[i],
        programId: programId,
      });
    }

    await ProgramAssigned.create({
      programId,
      teamId,
    });

    res.status(200).json({ message: "succesfull" });
  } catch (err) {
    console.log(err);
    error500(err, res);
  }
};

exports.postAction = async (req, res) => {
  try {
    // const { error } = postActionValidationSchema.validate(req);

    // if (error) {
    //   errorForJoi(error, res);
    // }
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    });

    const imageFile = req.files["image"][0];
    const audioFile = req.files["audio"][0];

    const imageParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/images/${Date.now()}_${imageFile.originalname}`,
      Body: imageFile.buffer,
    };
    const imageS3Response = await s3.upload(imageParams).promise();

    const audioParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/audio/${Date.now()}_${audioFile.originalname}`,
      Body: audioFile.buffer,
    };
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

    const createActionCompletion = async (frequency) => {
      await ActionCompletion.create({
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

    if (existingAction) {
      // If existing action found, update the frequency
      const updatedFrequency = Math.floor(existingAction.frequency) + 1;
      await createActionCompletion(updatedFrequency);
    } else {
      // If no existing action found, create a new record with frequency: 1
      await createActionCompletion(1);
    }

    const user = await User.findOne({ where: { id: req.user } });
    await user.update({ totalPoints: action.points });

    res.status(200).json({
      message: "successful",
      imageS3Response,
      audioS3Response,
    });
  } catch (err) {
    console.log(err);
    error500(err, res);
  }
};

exports.getHome = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user },
    });

    const userProgramIds = await UserActions.findAll({
      where: { userId: req.user },
      attributes: ["programId"],
    });

    const programIds = userProgramIds.map(
      (userProgram) => userProgram.programId
    );

    const programs = await Program.findAll({
      where: {
        id: programIds,
      },
    });

    const programData = [];

    // const actionCompletion = await ActionCompletion.findAll({
    //   where: { userId: req.user },
    // });

    for (const program of programs) {
      const actions = await Actions.findAll({
        where: { programId: program.id },
      });

      const actionsWithScores = [];

      for (const action of actions) {
        const latestActionCompletion = await ActionCompletion.findOne({
          where: { actionId: action.id, userId: req.user },
          order: [["createdAt", "DESC"]],
        });

        const actionCompletionSingle = await ActionCompletion.findAll({
          where: { actionId: action.id },
        });
        console.log(action.id);
        let habitScore = 0;
        let totalPoints = 0;
        let pointsEarned = 0;

        if (
          latestActionCompletion &&
          latestActionCompletion.frequency !== null
        ) {
          habitScore = Math.floor(
            (latestActionCompletion.frequency / action.duration) * 100
          );
        }

        if (action.duration !== null && action.points !== null) {
          totalPoints = action.duration * action.points;
        }

        if (
          latestActionCompletion &&
          latestActionCompletion.frequency !== null &&
          action.points !== null
        ) {
          pointsEarned = latestActionCompletion.frequency * action.points;
        }

        actionsWithScores.push({
          ...action.toJSON(),
          habitScore: habitScore,
          totalPoints: totalPoints,
          pointsEarned: pointsEarned,
          actionCompletion: actionCompletionSingle || null,
        });
      }

      programData.push({
        programId: program.id,
        programName: program.programName,
        description: program.description,
        actions: actionsWithScores,
      });
    }

    res.status(200).json({ user, programData });
  } catch (err) {
    console.log(err);
    error500(err, res);
  }
};

//need to link actions withnactionCompletion
