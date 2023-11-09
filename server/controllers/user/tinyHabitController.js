const TinyHabits = require("../../models/user/TinyHabitsModel");
const TinyHabitCompletion = require("../../models/user/TinyHabitCompletionModel");

//JOI
const postTinyHabitsSchema =
  require("../../helpers/validation").postTinyHabitsSchema;

//error
const errorForJoi = require("../../helpers/error").errorHandlerJoi;
const error500 = require("../../helpers/error").error500;

exports.postTinyHabits = async (req, res) => {
    try {
      // Extract 'habit_name' from the request body
      const { habit_name } = req.body;
  
      // Validate the request body against the schema
      const { error } = postTinyHabitsSchema.validate(req.body);
  
      if (error) {
        return errorForJoi(error, res);
      }
  
      // Check if a tiny habit with the same name already exists
      const existingTinyHabits = await TinyHabits.findOne({ where: { habit_name } });
  
      if (existingTinyHabits) {
        return res.status(400).json({ message: "A habit with the same name already exists." });
      }
  
      // Create a new tiny habit
      const createHabit = await TinyHabits.create({ habit_name });
  
      res.status(200).json({ message: "Tiny habit created successfully", habit: createHabit });
    } catch (err) {
      // Handle other errors, e.g., database errors
      error500(err, res);
    }
  };