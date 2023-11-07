//models
const Program = require("../../models/user/Programs");
const Actions = require("../../models/user/ActionsModel");
const Designation = require("../../models/user/DesignationModel");
const Department = require("../../models/user/DepartmentModel");
const Skills = require("../../models/user/SkillsModel");
const programDesignation = require("../../models/user/ProgramDesignationModel");
const programDepartment = require("../../models/user/ProgramDepartmentModel");
const programSkills = require("../../models/user/ProgramSkills");

//error handlers
const errorForJoi = require("../../helpers/error").errorHandlerJoi;
const error500 = require("../../helpers/error").error500;

//joiSchemas
const departmentSchema = require("../../helpers/validation").departmentSchema;
const skillSchema = require("../../helpers/validation").skillSchema;
const designationSchema = require("../../helpers/validation").designationSchema;

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

    const createProgram = await Program.create({
      programName,
      description,
      totalPoints,
    });
    for (let i = 0; i < actions.length; i++) {
      await Actions.create({
        name: actions[i].name,
        description: actions[i].description,
        points: actions[i].points,
        duration: actions[i].duration,
        programId: createProgram.id,
      });
    }

    for (let i = 0; i < departments.length; i++) {
      programDepartment.create({
        departmentId: departments[i],
        programId: createProgram.id,
      });
    }

    for (let i = 0; i < designations.length; i++) {
      programDesignation.create({
        designationId: designations[i],
        programId: createProgram.id,
      });
    }

    for (let i = 0; i < skills.length; i++) {
      programSkills.create({
        skillId: skills[i],
        programId: createProgram.id,
      });
    }
    res.status(200).json({ message: "program created succesfull" });
  } catch (err) {
    error500(err, res);
  }
};
