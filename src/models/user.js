import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    full_name: { type: String, required: true },
    login: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: Number, required: true },
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model("User", userSchema);
