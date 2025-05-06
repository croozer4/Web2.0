import { Request, Response } from "express";
import Review from "../models/Review";

// Dodanie recenzji
export const addReview = async (req: Request, res: Response): Promise<void> => {
    console.log("Dodanie recenzji rozpoczete");
  const { gameId, content, rating } = req.body;
  const userId = req.user?.userId;
  
  try {
    const newReview = new Review({
      userId,
      gameId,
      content,
      rating,
    });

    await newReview.save();
    res.status(201).json({ message: "Recenzja została dodana pomyślnie" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

// Usunięcie recenzji
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  const reviewId = req.params.id;

  try {
    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "Recenzja została usunięta" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

// Pobranie recenzji dla danej gry
export const getReviewsForGame = async (req: Request, res: Response): Promise<void> => {
  const gameId = req.params.gameId;

  try {
    const reviews = await Review.find({ gameId });
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

// Aktualizacja recenzji
export const updateReview = async (req: Request, res: Response): Promise<void> => {
  const reviewId = req.params.id;
  const { content, rating } = req.body;

  try {
    const updatedReview = await Review.findByIdAndUpdate(reviewId, { content, rating }, { new: true });
    res.status(200).json(updatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};
