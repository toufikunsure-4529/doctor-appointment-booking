import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

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

// API to get all Doctors List for admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password"); // find all doctors in database and exclude password
    res.json({ success: "true", message: "Doctors List", doctors });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: "false",
      message: `Internal Server Error : ${error.message}`,
    });
  }
};

// API to  get all Appointment List for admin panel
const appointmentAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res
      .status(200)
      .json({ success: "true", message: "Appointment List", appointments });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: "false",
      message: `Internal Server Error : ${error.message}`,
    });
  }
};

// API For Admin Dashboard to appoint cancellition
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // Releaseing the slot back to the calendar
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.status(200).json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      patients: users.length,
      appointments: appointments.length,
      latestAppointments: appointments.reverse().slice(0, 5), // reverse to show latest first
    };
    res.status(200).json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: "false",
      message: `Internal Server Error : ${error.message}`,
    });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentAdmin,
  appointmentCancel,
  adminDashboard,
};
