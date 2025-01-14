import mongoose from "mongoose";

const connectDB = mongoose.connect(process.env.MONGO_URL ?? "");
export default connectDB;
