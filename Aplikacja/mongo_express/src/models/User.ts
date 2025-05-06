import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  isAdmin: boolean;
  activationCode?: string;
  resetCode?: string;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    activationCode: { type: String, required: false },
    resetCode: { type: String, required: false },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
