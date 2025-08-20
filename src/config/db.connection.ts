import mongoose from "mongoose";
import { DB_CONNECTION_URL } from "./system-variables";
import {URL} from "./system-variables"

export const mongoConnection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/min-banks");

    //await mongoose.connect(URL);
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
};
