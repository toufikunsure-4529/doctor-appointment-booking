import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

//API to register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }
    //validation email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    // validation storng password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt); // hashing password

    const userData = {
      name: name,
      email: email,
      password: hashPassword,
    };

    const newUser = new userModel(userData); // creating new user object
    const user = await newUser.save(); // saving user to database
    //_id
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res
      .status(201)
      .json({ success: true, message: "User created successfully", token });
  } catch (error) {}
};
