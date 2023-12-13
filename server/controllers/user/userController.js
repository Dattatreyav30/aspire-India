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

//email
const emailSender = require("../../helpers/email");

const otpModel = require("../../models/user/otpModel");
const Streaks = require("../../models/user/streaksModel");

exports.userSignup = async (req, res) => {
  const t = await sequelize.transaction(); // Start a transaction

  try {
    // const { error } = userSchema.validate(req.body);

    // if (error) {
    //   return errorForJoi(error, res);
    // }

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

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const findEmail = await User.findOne({ where: { email } });
    if (!findEmail) {
      return res.status(400).json({ message: "user not found" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpCreation = await otpModel.create({
      userId: findEmail.id,
      otpCode: otp,
    });
    await emailSender(email, otp);
    deleteOtpRow(otpCreation.otpId);
    res.status(200).json({
      email: findEmail.email,
      message: "succesfull",
    });
  } catch (err) {
    error500(err, res);
  }
};

const deleteOtpRow = (otpId) => {
  setTimeout(async () => {
    try {
      await otpModel.destroy({ where: { otpId } });
    } catch (error) {}
  }, 1000 * 60 * 2);
};

exports.otpVerification = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "Invalid request" });
    }
    // console.log(user)
    const latestUserOtp = await otpModel.findOne({
      where: { userId: user.id },
      order: [["createdAt", "DESC"]],
    });
    if (Number(otp) !== Number(latestUserOtp.otpCode)) {
      return res.status(404).json({ message: "wrfong otp" });
    }
    await User.update({ isEmailVerified: true }, { where: { email } });
    res.status(200).json({ message: "otp verification is successfull" });
  } catch (err) {
    console.log(err);
    error500(err, res);
  }
};

exports.setPassword = async (req, res) => {
  try {
    const {email, password, confirmPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "Invalid request/user not found" });
    }
    if (password === confirmPassword) {
      const hashedPassword = await bcrypt.hash(password, 5);
      await User.update(
        { password: hashedPassword },
        { where: { id: user.id } }
      );
      await Streaks.create({ userId: user.id });
      res
        .status(200)
        .json({ message: "succesfull", token: generateAccessToken(user.id) });
    } else {
      res.status(400).json({ message: "password wont match" });
    }
  } catch (err) {
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
