const Program = require("../../models/user/Programs");
const Actions = require("../../models/user/ActionsModel");
const Designation = require("../../models/user/DesignationModel");
const Department = require("../../models/user/DepartmentModel");
const Skills = require("../../models/user/SkillsModel");

//joi error handler
const errorForJoi = require("../../helpers/error");

//joiSchemas
const departmentSchema = require("../../helpers/validation").departmentSchema;

//adding up the department

exports.postDepartment = async (req, res) => {
  try {
    const { departName } = req.body;
    const { error } = departmentSchema.validate(req.body);
    if (error) {
      errorForJoi(error);
    }
    let newDept = await Department.create({ departName });
    res
      .status(200)
      .json({ message: "user created succesfully", user: newDept });
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
