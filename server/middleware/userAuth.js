const jwt = require("jsonwebtoken");

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const generateAccessToken = (id) => {
  return jwt.sign({ token: id }, jwtSecretKey);
};

const authorization = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const tokenVerification = jwt.verify(token, jwtSecretKey);
    req.user = tokenVerification.token;
    console.log(req.userId);
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
};
module.exports = {
  generateAccessToken,
  authorization,
};
