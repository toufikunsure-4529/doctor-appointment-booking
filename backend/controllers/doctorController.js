import doctorModel from "../models/doctorModel.js";

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

export { changeAvailablity, doctorList };
