require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  // Ensure the user object has the required properties
  if (!user._id) {
    throw new Error("User object must contain _id");
  }
  return jwt.sign(
    { _id: user._id, userType: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;