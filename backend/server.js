import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongdb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middelwares
app.use(express.json()); //any req in express req will be parse this method for json format
app.use(cors()); // it will be allow to frotend and backend without cors error

// API endpoint
app.use("/api/admin", adminRouter); //localhost:4000/api/admin/add-doctor
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log("Server Started", port);
});
