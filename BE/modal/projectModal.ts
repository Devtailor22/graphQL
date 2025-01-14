import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  clientId: {
    type: mongoose.Types.ObjectId,
    ref: "clients",
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
  },
  status: {
    type: String,
    enum: ["INPROGRESS", "CLOSED"],
    default: "INPROGRESS",
  },
  tags: {
    type: [String],
  },
  priority: {
    type: String,
    enum: ["LOW", "MID", "HIGH"],
    default: "HIGH",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  isNotified: {
    type: Boolean,
    default: false,
  },
});

const projectModal = mongoose.model("projects", projectSchema);

export default projectModal;
