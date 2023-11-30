//models
const User = require("../../models/user/userModel");

//sequelize
const { Op, or } = require("sequelize");
const sequelize = require("../../util/database");
//joi user schemas
const userSchema = require("../../helpers/validation").userSchema;
const loginSchema = require("../../helpers/validation").loginSchema;

//libraries
const bcrypt = require("bcrypt");

//middlewares
const generateAccessToken =
  require("../../middleware/userAuth").generateAccessToken;

//error handler
const errorForJoi = require("../../helpers/error").errorHandlerJoi;
const error500 = require("../../helpers/error").error500;

//action schemas
const ActionCompletion = require("../../models/user/actionCompletion");

const { Sequelize, DataTypes } = require("sequelize");

exports.userSignup = async (req, res) => {
  const t = await sequelize.transaction(); // Start a transaction

  try {
    const { error } = userSchema.validate(req.body);

    if (error) {
      return errorForJoi(error, res);
    }

    const { email, phoneNumber, name, DOB, DOJ, gender, password } = req.body;

    // Check for an existing user within the transaction
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { phoneNumber }] },
      transaction: t, // Pass transaction object to the query
    });

    if (existingUser) {
      await t.rollback(); // Rollback transaction if user exists
      return res
        .status(409)
        .json({ error: "Email/phone number already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    // Create a user within the transaction
    await User.create(
      {
        email,
        phoneNumber,
        name,
        DOB,
        DOJ,
        gender,
        password: hashedPassword,
      },
      { transaction: t }
    ); // Pass transaction object to create method

    await t.commit(); // Commit the transaction
    res.status(201).json({ message: "User creation successful" });
  } catch (err) {
    console.error(err);
    await t.rollback(); // Rollback transaction on error
    error500(err, res);
  }
};

exports.login = async (req, res) => {
  const t = await sequelize.transaction(); // Start a transaction

  try {
    const { emailOrMobile, password } = req.body;

    const { error } = loginSchema.validate(req.body);

    //error handling if joi validation fails
    if (error) {
      errorForJoi(error, res);
    }

    //finding user with provided email or phone number
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrMobile }, { phoneNumber: emailOrMobile }],
      },
      transaction: t, // Pass transaction object to the query
    });

    // if no user found there should be wrong with email  or mobile number
    if (!user) {
      await t.rollback(); // Rollback transaction if user doesn't exist
      return res.status(403).json({ error: "Invalid email or mobile number" });
    }

    //matching password from user and password in the database
    const match = await bcrypt.compare(password, user.password);

    // password is incorrect if the wrong password is typed
    if (!match) {
      await t.rollback(); // Rollback transaction on password mismatch
      return res.status(401).json({ error: "Invalid password" });
    }

    await t.commit(); // Commit the transaction
    return res.status(200).json({
      message: "succesfull",
      token: generateAccessToken(user.id),
    });
  } catch (err) {
    await t.rollback(); // Rollback transaction on error
    error500(err, res);
  }
};

exports.getUserTower = async (req, res) => {
  try {
    const userId = req.user;
    console.log(userId);
    const actionCompletions = await ActionCompletion.findAll({
      where: { userId: userId },
    });
    res
      .status(200)
      .json({ message: "succesfull", actionCompletion: actionCompletions });
  } catch (err) {
    error500(err, res);
  }
};
