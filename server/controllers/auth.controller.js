import Auth from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
function getToken(id) {
  return jwt.sign({ id:id }, process.env.JWT_SECRET, { expiresIn: "24h" });
}

export const userSignup = async (req, res) => {
  try {
    // const { id } = req.auth;
    const { name, email, password } = req.body;

    // check all validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        error: {
          name: !name ? "name is required" : "",
          email: !email ? "email is required" : "",
          password: !password ? "password is required" : "",
        },
      });
    }

    // check if user if already eixests with this email
    const existingUser = await Auth.findOne({ where: {email: email} });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "this email is already registed login or change the email",
        error: { email: "this email is already registered" },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await Auth.create({ name, email, password: hashedPassword });

    // generate jwt token
    const token = await getToken(user.id);

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "strict",
      path: "/", // Available on all routes
    });

    res
      .status(201)
      .json({ success: true, message: "user created successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        error: {
          email: !email ? "email is required" : "",
          password: !password ? "password is required" : "",
        },
      });
    }

    const user = await Auth.findOne({ where: {email: email} });

    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User not found try again or signup",
          error: { email: "invalid email, user not found" },
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credintails",
        error: {
          password: "wrong password",
        },
      });
    }

    // generate jwt token
    const token = await getToken(user.id);

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "strict",
      path: "/", // Available on all routes
    });

    res
      .status(201)
      .json({ success: true, message: "user created successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get auth info
export const getAuth = async (req, res) => {
  try {
    if (req.auth) {
      res.status(200).json({ success: true, user: req.auth });
    } else {
      return res.status(404).json({ success: false, message: "Please login" });
    }
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ success: true, message: "logged out" });
  } catch (error){
    res.status(500).json({ success: false, message: error.message });
  }
}
