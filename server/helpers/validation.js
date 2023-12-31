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

const postTeamSchema = Joi.object({
  teamName: Joi.string().min(3).max(255).required(),
  userIds: Joi.array().items(Joi.number().integer()).min(1).required(),
});

const postTinyHabitsSchema = Joi.object({
  habit_name: Joi.string().min(3).max(255).required(),
});

const tinyHabitCompletionSchema = Joi.object({
  tinyHabitId: Joi.number().integer().min(1).required(),
});

const postProgramAssignedSchema = Joi.object({
  programId: Joi.string().required(),
  teamId: Joi.string().required(),
});

const PersonalityQnschema = Joi.object({
  questionName: Joi.string().required(),
  optionNames: Joi.array().items(Joi.string()).required(),
});

const postQnLogicJumpschema = Joi.object({
  questionName: Joi.string().required(),
  options: Joi.array()
    .items(
      Joi.object({
        option: Joi.string().required(),
        logicJumpId: Joi.number().required(),
      })
    )
    .required(),
});

const personalityOutcomeSchema = Joi.object({
  outcomeName: Joi.string().required(),
});

const personalityRecschema = Joi.object({
  questionAnsIds: Joi.array()
    .items(
      Joi.object({
        personalityQuestionId: Joi.string().required(),
        personalityOptionId: Joi.string().required(),
      })
    )
    .required(),
});

const postActionValidationSchema = Joi.object({
  body: Joi.object({
    text: Joi.string().required(),
    locationName: Joi.string().required(),
    actionId: Joi.number().required(),
    programId: Joi.number().required(),
  }),
  files: Joi.object({
    image: Joi.array()
      .items(
        Joi.object({
          originalname: Joi.string().required(),
          buffer: Joi.any().required(), // Assuming it's a buffer
          fieldname: Joi.string().required(), // Add fieldname validation
          // Add other expected properties if needed
        })
      )
      .required(),
    audio: Joi.array()
      .items(
        Joi.object({
          originalname: Joi.string().required(),
          buffer: Joi.any().required(), // Assuming it's a buffer
          fieldname: Joi.string().required(), // Add fieldname validation
          // Add other expected properties if needed
        })
      )
      .required(),
  }),
  user: Joi.any(), // Validate the user data type as per your application
});

const postLikesSchema = Joi.object({
  emoji_type: Joi.string().required(),
  communityPostId: Joi.string().required(),
});

const postPrecuratesMessagesSchema = Joi.object({
  message: Joi.string().required(),
});

module.exports = {
  userSchema,
  loginSchema,
  departmentSchema,
  skillSchema,
  designationSchema,
  programSchema,
  actionSchema,
  postTeamSchema,
  postTinyHabitsSchema,
  tinyHabitCompletionSchema,
  postProgramAssignedSchema,
  PersonalityQnschema,
  postQnLogicJumpschema,
  personalityOutcomeSchema,
  personalityRecschema,
  postActionValidationSchema,
  postLikesSchema,
  postPrecuratesMessagesSchema
};
