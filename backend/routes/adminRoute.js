import express from "express";
import {
  addDoctor,
  adminDashboard,
  allDoctors,
  appointmentAdmin,
  appointmentCancel,
  loginAdmin,
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailablity } from "../controllers/doctorController.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor); // authAdmin middlewares to check if the user is admin
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors); // authAdmin middlewares to check if the user is admin
adminRouter.post("/change-availablity", authAdmin, changeAvailablity);
adminRouter.get("/appointments", authAdmin, appointmentAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

export default adminRouter;
