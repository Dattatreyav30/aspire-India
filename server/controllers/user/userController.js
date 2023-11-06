const User = require("../../models/user/UserModel");

//joi user schemas
const userSchema = require("../../helpers/validation").userSchema;

exports.userSignup = async (req, res) => {
  try {
    // Validate the request body using Joi
    const { error } = userSchema.validate(req.body);
    console.log(req.body);

    if (error) {
      return res
        .status(400)
        .json({ error: "Validation error", details: error.details });
    }

    const { email, phoneNumber, name, DOB, DOJ, gender, password } = req.body;

    //same email id checking
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Create a user record in the database
    const userDataCreation = await User.create({
      email,
      phoneNumber,
      name,
      DOB,
      DOJ,
      gender,
      password,
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
