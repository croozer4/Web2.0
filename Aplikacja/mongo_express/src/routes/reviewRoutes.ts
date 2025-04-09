import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { checkReviewOwnership } from "../middleware/checkReviewOwnershipMiddleware";
import {
  addReview,
  deleteReview,
  getReviewsForGame,
  updateReview,
} from "../controllers/reviewsController";

const router = Router();

// Dodanie recenzji (wymaga tokenu)
router.post("/", verifyToken, addReview);
// router.post("/", addReview);

// Usunięcie recenzji (wymaga tokenu i sprawdzenia właściciela)
router.delete("/:id", verifyToken, checkReviewOwnership, deleteReview);

// Pobranie recenzji dla gry
router.get("/game/:gameId", verifyToken, getReviewsForGame);

// Aktualizacja recenzji (wymaga tokenu i sprawdzenia właściciela)
router.put("/:id", verifyToken, checkReviewOwnership, updateReview);

export default router;
