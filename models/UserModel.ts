import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: false },
  emailValidation: { type: Boolean, required: true, default: false },
  level: { type: Number, required: true, default: 1 },
  coin: { type: Number, required: true, default: 0 },
  status: { type: Boolean, required: true, default: true }
});

export const UserModel = (mongoose.models.user || mongoose.model('user', UserSchema));