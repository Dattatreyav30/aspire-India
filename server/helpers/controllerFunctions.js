const Program = require("../models/user/Programs");
const Actions = require("../models/user/ActionsModel");
const Designation = require("../models/user/DesignationModel");
const Department = require("../models/user/DepartmentModel");
const Skills = require("../models/user/SkillsModel");
const ProgramDesignation = require("../models/user/ProgramDesignationModel");
const ProgramDepartment = require("../models/user/ProgramDepartmentModel");
const ProgramSkills = require("../models/user/ProgramSkills");
const Team = require("../models/user/TeamModel");
const UserTeam = require("../models/user/userTeamModel");
const ProgramAssigned = require("../models/user/ProgramAssignedModel");
const ActionCompletion = require("../models/user/ActionCompletion");
const User = require("../models/user/UserModel");
const UserActions = require("../models/user/UserActionsModel");

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
    const userProgramIds = await UserActions.findAll({
      where: { userId },
      attributes: ["programId"],
    });
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

module.exports = {
  getUser,
  getActionsWithScores,
  getProgramData,
  getUserProgramIds,
};
