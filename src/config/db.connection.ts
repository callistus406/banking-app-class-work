import mongoose from "mongoose";

export const mongoConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/min-banks",
    );
      console.log("database connected")
  } catch (error) {
      console.log(error)
  }
};
