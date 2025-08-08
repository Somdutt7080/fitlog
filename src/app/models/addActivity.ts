import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["Run", "Walk", "Ride"],
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  pace: {
    type: String,
    required: true,
  },
  route: {
    type: [[Number]], // array of [lat, lng]
    required: true,
  },
  steps: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  }

}, { timestamps: true });

export const Activity = mongoose.models.Activity || mongoose.model("Activity", activitySchema);

