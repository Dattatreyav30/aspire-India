const Program = require("../../models/user/Programs");
const Actions = require("../../models/user/ActionsModel");
const Designation = require("../../models/user/DesignationModel");
const Department = require("../../models/user/DepartmentModel");
const Skills = require("../../models/user/SkillsModel");

//joi error handler
const errorForJoi = require("../../helpers/error").errorHandlerJoi;

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
    const existingDepartment = await Department.findOne({ departmentName });

    if (existingDepartment) {
      return res.status(400).json({ message: "Department already exists" });
    }

    let newDept = await Department.create({ departmentName });
    res
      .status(200)
      .json({ message: "Department created successfully", dept: newDept });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    const existingSkill = await Skills.findOne({ skillName });

    if (existingSkill) {
      return res.status(400).json({ message: "Skill already exists" });
    }

    let newSkill = await Skills.create({ skillName });
    res
      .status(200)
      .json({ message: "Skill created successfully", skill: newSkill });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    const existingDesignation = await Designation.findOne({ designationName });

    if (existingDesignation) {
      return res.status(400).json({ message: "Designation already exists" });
    }

    let newDesignation = await Designation.create({ designationName });
    res.status(200).json({
      message: "Designation created successfully",
      designation: newDesignation,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//testing, it can be realated to aspire flow
// exports.postProgramWithActions = async (req, res) => {
//   try {
//     const { programs } = req.body.Program;
//     for (let i = 0; i < programs.length; i++) {
//       let program = await Program.create({
//         programName,
//         description,
//         totalPoints,
//         duration,
//       });
//       //adding actions to the programs
//     }
//   } catch (err) {
//     res.status(500).json({ err: err.message });
//   }
// };
