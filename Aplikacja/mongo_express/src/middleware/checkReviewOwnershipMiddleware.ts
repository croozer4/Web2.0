import { Request, Response, NextFunction } from "express";
import Review from "../models/Review";

// Middleware do sprawdzania, czy recenzja należy do użytkownika
export const checkReviewOwnership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const reviewId = req.params.id;
  const userId = req.user?.userId;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      res.status(404).json({ message: "Recenzja nie znaleziona" });
      return;
    }

    if (review.userId.toString() !== userId) {
      res.status(403).json({ message: "Nie masz uprawnień do edytowania lub usuwania tej recenzji" });
      return;
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};
