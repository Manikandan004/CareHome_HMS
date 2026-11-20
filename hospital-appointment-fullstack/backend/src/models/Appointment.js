const mongoose = require("mongoose");

const schema = new mongoose.Schema({

  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  date: { type: String, required: true }, time: { type: String, required: true },

  status: { type: String, enum: ["BOOKED", "COMPLETED", "CANCELLED"], default: "BOOKED" },

  doctorComment: { type: String, default: "" }

}, { timestamps: true });

schema.index({ doctor: 1, date: 1, time: 1, status: 1 });

module.exports = mongoose.model("Appointment", schema);
