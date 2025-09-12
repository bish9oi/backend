// models/issue.model.js
import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true }, // 🖼️ required
    response: {
      text: { type: String },
      treatment: { type: String },
      precautions: { type: String },
      reviewedAt: { type: Date },
    }, // ✅ nested object
    status: {
      type: String,
      enum: ["open", "assigned", "reviewed"],
      default: "open",
    },
  },
  { timestamps: true }
);

export const Issue = mongoose.model("Issue", issueSchema);
