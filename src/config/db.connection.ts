import mongoose from "mongoose";
import { DB_CONNECTION_URL } from "./system-variables";

export const mongoConnection = async () => {
  try {
    // await mongoose.connect("mongodb://localhost:27017/");
    await mongoose.connect(DB_CONNECTION_URL);
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
};
