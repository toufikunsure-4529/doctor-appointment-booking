import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

// Change Doctor Availability
const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body; // Extract docId from req.body
    if (!docId) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor ID is required" });
    }

    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.status(200).json({ success: true, message: "Availability changed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

// doctor list get on frontend

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-email", "-password"]); // Find all doctors
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

//API for doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body; // Extract email and password from req.body
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message:
          "Invalid Credentials, please use correct credentials or contact admin",
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    // Generate JWT token
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.status(200).json({ success: true, token });
    } else {
      res.status(404).json({
        success: false,
        message:
          "Invalid Credentials, please use correct credentials or contact admin",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.user; // Read docId from req.user
    const appointments = await appointmentModel.find({ docId });
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res
        .status(200)
        .json({ success: true, message: "Appointment completed successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Appointment Mark Failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res
        .status(200)
        .json({ success: true, message: "Appointment cancelled successfully" });
    } else {
      return res.status(404).json({
        success: false,
        message: "Invalid Appointment cancelled Failed",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

// API to get  dashboard  data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.user.docId; // Use docId from authDoctor middleware
    const appointments = await appointmentModel.find({ docId });

    let earning = 0;
    appointments.forEach((item) => {
      if (item.isCompleted) {
        earning += item.amount; // Use amount instead of price
      }
    });

    let patients = [];
    appointments.forEach((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earning,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    return res.status(200).json({ success: true, dashData });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

//API to get  docto profile   data for doctor panel
const doctorProfile = async (req, res) => {
  try {
    const docId = req.user.docId; // Use docId from authDoctor middleware
    const profileData = await doctorModel.findById(docId).select("-password");
    return res.status(200).json({ success: true, profileData });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

// API to update doctor profile from doctor panel
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.user.docId; // Use docId from authDoctor middleware
    const { fees, address, available } = req.body;
    const updatedProfile = await doctorModel.findByIdAndUpdate(
      docId,
      {
        fees,
        address,
        available,
      },
      { new: true }
    );
    return res.status(200).json({ success: true, updatedProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export {
  changeAvailablity,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
};
