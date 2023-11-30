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

const sequelize = require("../../util/database");

exports.postTinyHabits = async (req, res) => {
  const t = await sequelize.transaction(); // Start a transaction

  try {
    const { habit_name } = req.body;

    const { error } = postTinyHabitsSchema.validate(req.body);

    // Handle Joi validation errors
    if (error) {
      return errorForJoi(error, res);
    }

    const existingTinyHabits = await TinyHabits.findOne({
      where: { habit_name },
      transaction: t, // Pass transaction object to the query
    });

    if (existingTinyHabits) {
      await t.rollback(); // Rollback transaction if habit with the same name exists
      return res
        .status(400)
        .json({ message: "A habit with the same name already exists." });
    }

    const createHabit = await TinyHabits.create(
      { habit_name },
      { transaction: t }
    );

    await t.commit(); // Commit the transaction
    res
      .status(200)
      .json({ message: "Tiny habit created successfully", habit: createHabit });
  } catch (err) {
    await t.rollback(); // Rollback transaction on error
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
  const t = await sequelize.transaction(); // Start a transaction

  try {
    const { tinyHabitId } = req.body;
    const userId = req.user;

    const { error } = tinyHabitCompletionSchema.validate(req.body);

    // Handle Joi validation errors
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingTinyHabit = await TinyHabitCompletion.findOne({
      where: { userId, tinyHabitId },
      transaction: t, // Pass transaction object to the query
    });

    if (existingTinyHabit) {
      await t.rollback(); // Rollback transaction if the user has already completed the habit
      return res
        .status(400)
        .json({ message: "The user has already completed this tiny habit." });
    }

    const tinyHabit = await TinyHabitCompletion.create({ userId, tinyHabitId }, { transaction: t });

    await t.commit(); // Commit the transaction
    res.status(200).json({
      message: "Tiny habit completion recorded successfully",
      habit: tinyHabit,
    });
  } catch (err) {
    await t.rollback(); // Rollback transaction on error
    error500(err, res);
  }
};
