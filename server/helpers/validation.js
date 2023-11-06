const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string().required(),
  name: Joi.string().required(),
  DOB: Joi.date().required(),
  DOJ: Joi.date().required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  totalPoints: Joi.number().integer().min(0).default(0),
  isMobileVerified: Joi.boolean().default(false),
  isEmailVerified: Joi.boolean().default(false),
});

module.exports = {
  userSchema,
};
