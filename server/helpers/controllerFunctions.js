const Program = require("../models/user/programs");
const Actions = require("../models/user/actionsModel");
// const Designation = require("../models/user/DesignationModel");
// const Department = require("../models/user/DepartmentModel");
// const Skills = require("../models/user/SkillsModel");
// const ProgramDesignation = require("../models/user/ProgramDesignationModel");
// const ProgramDepartment = require("../models/user/ProgramDepartmentModel");
// const ProgramSkills = require("../models/user/ProgramSkills");
// const Team = require("../models/user/TeamModel");
const UserTeam = require("../models/user/userTeamModel");
const ProgramAssigned = require("../models/user/programAssignedModel");
const ActionCompletion = require("../models/user/actionCompletion");
const User = require("../models/user/userModel");
const UserPrograms = require("../models/user/userProgramsModel");

const getUser = async (userId) => {
  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] },
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const getUserProgramIds = async (userId) => {
  try {
    console.log(userId);
    console.log(UserPrograms);
    const userProgramIds = await UserPrograms.findAll({
      where: { userId },
      attributes: ["programId"],
    });

    console.log(userProgramIds);
    return userProgramIds.map((userProgram) => userProgram.programId);
  } catch (error) {
    throw error;
  }
};

const getActionsWithScores = async (programId, userId) => {
  try {
    const actions = await Actions.findAll({
      where: { programId },
    });

    const actionsWithScores = [];

    for (const action of actions) {
      const latestActionCompletion = await ActionCompletion.findOne({
        where: { actionId: action.id, userId },
        order: [["createdAt", "DESC"]],
      });

      const actionCompletionSingle = await ActionCompletion.findAll({
        where: { actionId: action.id },
      });

      let habitScore = 0;
      let totalPoints = 0;
      let pointsEarned = 0;

      if (latestActionCompletion && latestActionCompletion.frequency !== null) {
        habitScore = Math.floor(
          (latestActionCompletion.frequency / action.duration) * 100
        );
        pointsEarned = latestActionCompletion.frequency * action.points;
      }

      if (action.duration !== null && action.points !== null) {
        totalPoints = action.duration * action.points;
      }
      actionsWithScores.push({
        ...action.toJSON(),
        habitScore,
        totalPoints,
        pointsEarned,
        actionCompletion: actionCompletionSingle || null,
      });
    }

    return actionsWithScores;
  } catch (error) {
    throw error;
  }
};

const getProgramData = async (programIds, userId) => {
  try {
    const programs = await Program.findAll({
      where: { id: programIds },
    });

    const programData = [];

    for (const program of programs) {
      const actionsWithScores = await getActionsWithScores(program.id, userId);

      const team = await ProgramAssigned.findOne({
        where: { programId: program.id },
        attributes: ["teamId"],
      });

      const users = await UserTeam.findAll({ where: { teamId: team.teamId } });

      programData.push({
        programId: program.id,
        programName: program.programName,
        description: program.description,
        actions: actionsWithScores,
        UserTeam: users,
      });
    }

    return programData;
  } catch (error) {
    throw error;
  }
};

const AWS = require("aws-sdk");
const UserActions = require("../models/user/userActionsModel");
require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const s3ImageParams = (imageFile, route) => {
  const imageParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${route}${Date.now()}_${imageFile.originalname}`,
    Body: imageFile.buffer,
  };
  return imageParams;
};

const s3AudioParams = (audioFile, route) => {
  const audioParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${route}${Date.now()}_${audioFile.originalname}`,
    Body: audioFile.buffer,
  };
  return audioParams;
};

const createUserActions = async (userId, actionId, programId) => {
  await UserActions.create({
    userId: userId,
    actionId: actionId,
    programId: programId,
  });
};
module.exports = {
  getUser,
  getActionsWithScores,
  getProgramData,
  getUserProgramIds,
  s3,
  s3ImageParams,
  s3AudioParams,
  createUserActions,
};
