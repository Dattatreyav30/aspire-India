//models
const User = require("../../models/user/UserModel");

//sequelize
const { Op, or } = require("sequelize");

//joi user schemas
const userSchema = require("../../helpers/validation").userSchema;

//libraries
const bcrypt = require("bcrypt");

exports.userSignup = async (req, res) => {
  try {
    // Validate the request body using Joi
    const { error } = userSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ error: "Validation error", details: error.details });
    }

    const { email, phoneNumber, name, DOB, DOJ, gender, password } = req.body;

    //same email id checking
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { phoneNumber }] },
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Email/phone number already in use" });
    }

    //hashing user password
    const hashedPassword = await bcrypt.hash(password, 5);

    // Create a user record in the database
    const userDataCreation = await User.create({
      email,
      phoneNumber,
      name,
      DOB,
      DOJ,
      gender,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "User creation successful", data: userDataCreation });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;
    // const decryptedPassword = await bcrypt.compare()
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrMobile }, { phoneNumber: emailOrMobile }],
      },
    });
    if (!user) {
      return res.status(403).json({ error: "Invalid email or mobile number" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid password" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};
