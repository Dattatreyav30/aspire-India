const jwt = require("jsonwebtoken");

const jwtSecretKey = process.env.JWT_SECRET_KEY

const generateAccessToken = (id) => {
  return jwt.sign({ token: id }, jwtSecretKey);
}

module.exports = {
    generateAccessToken
}