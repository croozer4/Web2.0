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

router.post("/", verifyToken, addReview);
router.delete("/:id", verifyToken, checkReviewOwnership, deleteReview);
router.get("/game/:gameId", verifyToken, getReviewsForGame);
router.put("/:id", verifyToken, checkReviewOwnership, updateReview);

export default router;
