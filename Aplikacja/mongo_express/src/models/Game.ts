import mongoose, { Schema, Document } from "mongoose";

interface IGame extends Document {
  name: string;
  genre: string;
  platform: string;
  releaseDate: Date;
  description: string;
}

const gameSchema = new Schema<IGame>({
  name: { type: String, required: true },
  genre: { type: String, required: true },
  platform: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

const Game = mongoose.model<IGame>("Game", gameSchema);

export default Game;
