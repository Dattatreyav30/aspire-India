const TinyHabits = require("../../models/user/tinyHabitsModel");
const TinyHabitCompletion = require("../../models/user/tinyHabitCompletionModel");

//JOI
const postTinyHabitsSchema =
  require("../../helpers/validation").postTinyHabitsSchema;
const tinyHabitCompletionSchema =
  require("../../helpers/validation").tinyHabitCompletionSchema;

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
    const existingTinyHabits = await TinyHabits.findOne({
      where: { habit_name },
    });

    if (existingTinyHabits) {
      return res
        .status(400)
        .json({ message: "A habit with the same name already exists." });
    }

    // Create a new tiny habit
    const createHabit = await TinyHabits.create({ habit_name });

    res
      .status(200)
      .json({ message: "Tiny habit created successfully", habit: createHabit });
  } catch (err) {
    // Handle other errors, e.g., database errors
    error500(err, res);
  }
};

exports.getTinyHabits = async (req, res) => {
  try {
    const habits = await TinyHabits.findAll();
    res.status(200).send(habits);
  } catch (err) {
    error500(err, res);
  }
};

exports.tinyHabitCompletion = async (req, res) => {
    try {
      // Extract 'tinyHabitId' from the request body and 'userId' from the request (assuming you store userId in req.userId)
      const { tinyHabitId } = req.body;
      const userId = req.user;
  
      // Validate the request body against the schema
      const { error } = tinyHabitCompletionSchema.validate(req.body);
  
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      // Check if the user has already completed the same tiny habit
      const existingTinyHabit = await TinyHabitCompletion.findOne({
        where: { userId, tinyHabitId },
      });
  
      if (existingTinyHabit) {
        // If a record already exists, you can handle this case as needed (e.g., return an error)
        return res.status(400).json({ message: "The user has already completed this tiny habit." });
      }
  
      // Create a new tiny habit completion record
      const tinyHabit = await TinyHabitCompletion.create({ userId, tinyHabitId });
  
      res.status(200).json({ message: "Tiny habit completion recorded successfully", habit: tinyHabit });
    } catch (err) {
      error500(err, res);
    }
  };
