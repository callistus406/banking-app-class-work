import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    password: { type: String, require: true },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    date_of_birth: {
      type: Date,
      require: true,
    },

    is_veified: {
      type: Boolean,
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
  },
  {
    timestamps: true,
  }
);

export const userModel = mongoose.model("User", userSchema);
