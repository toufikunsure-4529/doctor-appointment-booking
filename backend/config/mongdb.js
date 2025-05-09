import mongoose from "mongoose";

const connectDB = async () => {
    //mongoose connect chek if on connected event to simple connect 
  mongoose.connection.on("connected", () => {
    console.log("Database Connected");
  });
//   it is a methood to connect 
  await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`); //pass mongoDBURI aand /prescripto is Databse name for create mongo DB
};

export default connectDB;
