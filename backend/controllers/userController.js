import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Razorpay from "razorpay";

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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

// API endpoint to login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // comparing password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // generating token
      res
        .status(200)
        .json({ success: true, message: "User logged in successfully", token });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

// API to user Profile Data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.user; // getting user id from request body for user get token and get user profile id
    const userData = await userModel.findById(userId).select("-password");
    res
      .status(200)
      .json({ success: true, message: "User Profile Data", userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

// Update the user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body; // Exclude email from destructuring
    const imageFile = req.file; // Getting image file from request

    // Validate required fields
    if (!userId || !name || !phone || !address || !dob || !gender) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    // Parse address
    let parsedAddress;
    try {
      parsedAddress = JSON.parse(address);
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid address format" });
    }

    // Update user profile details
    const updateData = {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    };

    const user = await userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Handle image upload
    if (imageFile) {
      try {
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
          resource_type: "image",
        });
        const imageURL = imageUpload.secure_url;

        await userModel.findByIdAndUpdate(
          userId,
          { image: imageURL },
          { new: true }
        );
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res
          .status(500)
          .json({ success: false, message: "Failed to upload image" });
      }
    }

    return res
      .status(200)
      .json({ success: true, message: "User profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// API to bookappointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    // Validate required fields
    if (!userId || !docId || !slotDate || !slotTime) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: userId, docId, slotDate, or slotTime",
      });
    }

    // Fetch doctor data
    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    if (!docData.available) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor is not available" });
    }

    // Check slot availability
    let slots_booked = docData.slots_booked || {};
    if (slots_booked[slotDate]?.includes(slotTime)) {
      return res
        .status(400)
        .json({ success: false, message: "Slot is already booked" });
    }

    // Update slots_booked
    if (!slots_booked[slotDate]) {
      slots_booked[slotDate] = [];
    }
    slots_booked[slotDate].push(slotTime);

    // Fetch user data
    const userData = await userModel.findById(userId).select("-password");
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Prepare appointment data
    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData: { ...docData.toObject(), slots_booked: undefined }, // Exclude slots_booked
      amount: docData.fees,
      date: Date.now(),
    };

    // Save appointment
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Update doctor's slots_booked
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// API to get user appointments for frontend my-appointment page
const listAppointment = async (req, res) => {
  try {
    const userId = req.user.userId; // Get userId from auth middleware
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - user ID not found",
      });
    }
    const appointments = await appointmentModel.find({ userId });
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// Cancel appointment API
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.user.userId;
    const appointmentData = await appointmentModel.findById(appointmentId);
    // Verify appointment User
    if (appointmentData.userId !== userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - you are not the owner of this appointment",
      });
    }

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

// Initialize Razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API to create Razorpay payment order
const paaymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // Validate input
    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    // Fetch appointment data
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointmentData.cancelled) {
      return res.status(400).json({
        success: false,
        message: "Appointment is cancelled",
      });
    }

    if (appointmentData.payment) {
      return res.status(400).json({
        success: false,
        message: "Payment already completed",
      });
    }

    // Create Razorpay order
    const options = {
      amount: appointmentData.amount * 100, // Amount in paise
      currency: process.env.CURRENCY || "INR",
      receipt: appointmentId,
    };

    const order = await razorpayInstance.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message || "Unknown error"}`,
    });
  }
};

// API to verify payment
const verifyPayment = async (req, res) => {
  try {
    const {
      appointmentId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    // Validate input
    if (
      !appointmentId ||
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment details",
      });
    }

    // Verify payment signature
    const crypto = require("crypto");
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Update appointment payment status
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { payment: true, paymentId: razorpay_payment_id },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message || "Unknown error"}`,
    });
  }
};




export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paaymentRazorpay,
  verifyPayment,
};
