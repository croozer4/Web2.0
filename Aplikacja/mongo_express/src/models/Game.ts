  import mongoose, { Schema, Document } from "mongoose";

  interface IGame extends Document {
    title: string;
    developer: string;
    release_year: number;
    platforms: string[];
    genre: string[];
    rating: number;
    price: number;
    image_url: string;
  }

  const gameSchema = new Schema<IGame>(
    {
      title: { type: String, required: true },
      developer: { type: String, required: true },
      release_year: { type: Number, required: true },
      platforms: { type: [String], required: true },
      genre: { type: [String], required: true},
      rating: { type: Number, required: true },
      price: { type: Number, required: true },
      image_url: {type: String, required: true }
    },
    { timestamps: true }
  );

  const Game = mongoose.model<IGame>("Game", gameSchema);

  export default Game;
