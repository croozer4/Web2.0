import mongoose, { Schema, Document } from "mongoose";

// Interfejs IReview - struktura danych recenzji
interface IReview extends Document {
  userId: mongoose.Schema.Types.ObjectId; // ID użytkownika
  gameId: mongoose.Schema.Types.ObjectId;  // ID gry
  content: string; // Treść recenzji
  rating: number;  // Ocena (1-5)
  createdAt: Date; // Data stworzenia
  updatedAt: Date; // Data ostatniej aktualizacji
}

const reviewSchema = new Schema<IReview>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Odwołanie do użytkownika
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },  // Odwołanie do gry
    content: { type: String, required: true },  // Treść recenzji
    rating: { type: Number, required: true, min: 1, max: 5 },  // Ocena od 1 do 5
  },
  { timestamps: true } // Automatycznie dodaje createdAt i updatedAt
);

// Tworzenie modelu
const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
