import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";

//API for adding Doctors
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;
    //checking All fields are filled add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !imageFile
    ) {
      return res
        .status(400)
        .json({ success: "false", message: "Please fill all fields" });
    }

    // Validating Email
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: "false", message: " Invalid Email" });
    }
    //  Validating Password
    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: "false", message: "Password is too weak" });
    }

    // encript hashing doctors password
    const salt = await bcrypt.genSalt(10); //genrate and pass salt roundes 10
    const hashPassword = await bcrypt.hash(password, salt);

    //upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url; //get image url from cloudinary

    const doctorData = {
      name,
      email,
      password: hashPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      image: imageUrl,
      date: Date.now(),
    };
    const newDoctor = new doctorModel(doctorData); // create new doctor object
    await newDoctor.save(); // save doctor to database mongoDB
    return res
      .status(201)
      .json({ success: "true", message: "Doctor Added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: "false",
      message: `Internal Server Error : ${error.message}`,
    });
  }
};

//API for the Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body; // get email and password from request body
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET); //generate token combine encript for email pass and jwt secret key env file under define
      res.status(200).json({
        success: "true",
        message: "Admin Login Successfully",
        token: token,
      });
    } else {
      return res
        .status(400)
        .json({ success: "false", message: "Invalid Credintials" }); // return error if email or password is invalid
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: "false",
      message: `Internal Server Error : ${error.message}`,
    });
  }
};

export { addDoctor, loginAdmin };
