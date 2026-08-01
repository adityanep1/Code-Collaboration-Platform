const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    console.log("Step 1");

    const { name, email, password } = req.body;

    console.log("Step 2", req.body);

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    console.log("Step 3");

    const existingUser = await User.findOne({ email });

    console.log("Step 4");

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    console.log("Step 5");

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Step 6");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("Step 7");

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    // Step 1: Get data from request body
    const { email, password } = req.body;

    // Step 2: Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }
//find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Compare password
const isPasswordCorrect = await bcrypt.compare(password, user.password);

if (!isPasswordCorrect) {
  return res.status(401).json({
    success: false,
    message: "Invalid password.",
  });
}

const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

return res.status(200).json({
  success: true,
  message: "Login successful.",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { register, login };