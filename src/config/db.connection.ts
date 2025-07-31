import mongoose from "mongoose";
import { DB_CONNECTION_URL } from "./system-variables";

export const mongoConnection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/min-banks");

    // await mongoose.connect(
    //   "mongodb+srv://certification:sQK7y5s9olkEYGWN@capacitybay1.rnocupk.mongodb.net/min-bank"
    // );
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
};
