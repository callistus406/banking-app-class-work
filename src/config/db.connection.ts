import mongoose from "mongoose";
import { DB_CONNECTION_URL } from "./system-variables";

export const mongoConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://certification:sQK7y5s9olkEYGWN@capacitybay1.rnocupk.mongodb.net/min-bank"
    );

    // await mongoose.connect(DB_CONNECTION_URL);
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
};
