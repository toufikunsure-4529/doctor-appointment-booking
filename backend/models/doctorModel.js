// This file to create mongooes models that for store the database create dotor models schema
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, //this schema to create doctor prpfile to db poirporty type and requred define and objects
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
  },
  { minimize: false }
); //if any schema property empty data object defailt pass to must be this minimize false write {minimize:false}

const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema); // it's will be check doctor model here are not if not here create new model and set schema

export default doctorModel;
