import { Request, Response } from "express";
import Review from "../models/Review";
import User from "../models/User";

// Dodanie recenzji
export const addReview = async (req: Request, res: Response): Promise<void> => {
    console.log("Dodanie recenzji rozpoczete");
    const { gameId, content, rating } = req.body;
    const userId = req.user?.userId; // Zakładam, że userId jest dostępne po uwierzytelnieniu

    if (!userId) {
        res.status(401).json({ message: "Użytkownik nieautoryzowany." });
        return;
    }

    try {
        // Pobierz nazwę użytkownika na podstawie userId
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "Użytkownik nie znaleziony." });
            return;
        }
        const username = user.username; // Pobieramy username z obiektu użytkownika

        const newReview = new Review({
            userId,
            gameId,
            content,
            rating,
            username, // <--- Zapisujemy username bezpośrednio!
        });

        await newReview.save();

        // Zwróć utworzoną recenzję (teraz już z username)
        res.status(201).json(newReview);
    } catch (error: any) {
        console.error("Błąd podczas dodawania recenzji:", error);
        if (error.name === 'MongoServerError' && error.code === 11000) {
          res.status(409).json({ message: "Już dodałeś opinię do tej gry." });
        } else if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Wystąpił błąd serwera podczas dodawania recenzji." });
        }
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
        console.error("Błąd podczas pobierania recenzji dla gry:", error);
        res.status(500).json({ message: "Wystąpił błąd serwera podczas pobierania recenzji." });
    }
};

// Aktualizacja recenzji
export const updateReview = async (req: Request, res: Response): Promise<void> => {
    const reviewId = req.params.id;
    const { content, rating } = req.body;
    const userId = req.user?.userId;

    try {
        const reviewToUpdate = await Review.findById(reviewId);

        if (!reviewToUpdate) {
            res.status(404).json({ message: "Recenzja nie znaleziona." });
            return;
        }

        if (reviewToUpdate.userId.toString() !== userId) {
            res.status(403).json({ message: "Brak uprawnień do aktualizacji tej recenzji." });
            return;
        }

        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { content, rating },
            { new: true }
        );
        // Po aktualizacji zwracamy zaktualizowany obiekt, który już ma username
        res.status(200).json(updatedReview);
    } catch (error) {
        console.error("Błąd podczas aktualizacji recenzji:", error);
        res.status(500).json({ message: "Wystąpił błąd serwera podczas aktualizacji recenzji." });
    }
};

