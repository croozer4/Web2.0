import mongoose, { Schema, Document } from "mongoose";

interface IReview extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  gameId: mongoose.Schema.Types.ObjectId;
  content: string;
  rating: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    username: { type: String, required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
