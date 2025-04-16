import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isActive: boolean;  // Pole do oznaczania, czy konto zostało aktywowane
  isAdmin: boolean;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: false }, // Konto nieaktywne po rejestracji
  isAdmin: { type: Boolean, default: false }, // <--- NOWE POLE
}, { timestamps: true });

const User = mongoose.model<IUser>("User", userSchema);

export default User;
