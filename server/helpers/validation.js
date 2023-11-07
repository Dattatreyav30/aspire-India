const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string().min(10).required(),
  name: Joi.string().required(),
  DOB: Joi.date().required(),
  DOJ: Joi.date().required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  totalPoints: Joi.number().integer().min(0).default(0),
  isMobileVerified: Joi.boolean().default(false),
  isEmailVerified: Joi.boolean().default(false),
});

const loginSchema = Joi.object({
  emailOrMobile: Joi.alternatives().try(
    Joi.string().required(),
    Joi.string().length(10).required()
  ),
  password: Joi.string().required(),
});

const departmentSchema = Joi.object({
  departmentName: Joi.string(),
});

const skillSchema = Joi.object({
  skillName: Joi.string(),
});

const designationSchema = Joi.object({
  designationName: Joi.string(),
});

const programSchema = Joi.object({
  programName: Joi.string().required(),
  description: Joi.string().required(),
  points: Joi.number().integer().min(0).required(),
  action: Joi.array().items(Joi.string()).required(),
  departments: Joi.array().items(Joi.string()).required(),
  skills: Joi.array().items(Joi.string()).required(),
  designations: Joi.array().items(Joi.string()).required(),
});

const actionSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  duration: Joi.number().integer().min(1).required(),
  points: Joi.number().integer().min(0).required(),
});

module.exports = {
  userSchema,
  loginSchema,
  departmentSchema,
  skillSchema,
  designationSchema,
  programSchema,
  actionSchema
};
