//models
const User = require("../../models/user/UserModel");

//sequelize
const { Op, or } = require("sequelize");

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


exports.userSignup = async (req, res) => {
  try {
    // Validate the request body using Joi
    const { error } = userSchema.validate(req.body);

    //errorHandler for joi
    if(error){
      errorForJoi(error,res)
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
    console.log(userDataCreation.id)
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

    // Validate the request body using Joi
    const { error } = loginSchema.validate(req.body);
    
    //error handling if joi validation fails
    if (error) {
     errorForJoi(error,res);
    }

    //finding user with provided email or phone number
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrMobile }, { phoneNumber: emailOrMobile }],
      },
    });

    // if no user found there should be wrong with email  or mobile number
    if (!user) {
      return res.status(403).json({ error: "Invalid email or mobile number" });
    }

    //matching pssword from user and password in database
    const match = await bcrypt.compare(password, user.password);

    // password is incorrect if wrong password is typed
    if (!match) {
      return res.status(401).json({ error: "Invalid password" });
    }
    return res.status(200).json({
      message: "user logged in succesfully",
      token: generateAccessToken(user.id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};
