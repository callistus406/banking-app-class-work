import mongoose, {Schema} from "mongoose";

export const uploadSchema = new Schema({
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

export const UploadModel = mongoose.model("Upload", uploadSchema);
