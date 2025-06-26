import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  id: { type: mongoose.Schema.Types.ObjectId, require: true, unique: true },
  title: { type: String },
  first_name: { type: String, require: true },
  last_name: { type: String, require: true },
  password: { type: String, require: true },
  username: {
    type: String,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  date_of_birth: {
    type: Date,
    require: true,
  },
  gender: {
    type: String,
    require: true,
  },
  phone_number: {
    type: String,
    require: true,
    unique: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    postcode: Number,
  },
  occupation: { type: String },
  picture: { type: String },
});

export const userModel = mongoose.model("User", userSchema);
