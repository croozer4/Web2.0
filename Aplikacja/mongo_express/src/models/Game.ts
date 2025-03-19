import mongoose, { Schema, Document } from "mongoose";

interface IGame extends Document {
  title: string;
  developer: string;
  release_year: number;
  platforms: string[];
  rating: number;
  price: number;
}

const gameSchema = new Schema<IGame>(
  {
    title: { type: String, required: true },
    developer: { type: String, required: true },
    release_year: { type: Number, required: true },
    platforms: { type: [String], required: true },
    rating: { type: Number, required: true },
    price: { type: Number, required: true }
  },
  { timestamps: true }
);

const Game = mongoose.model<IGame>("Game", gameSchema);

export default Game;
