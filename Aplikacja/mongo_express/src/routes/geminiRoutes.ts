// src/routes/geminiRoutes.ts
import express from "express";
import {
  summarizeGameReviews,
  getGeneratedGames,
  getGeneratedGameById,
  getGamesByType,
} from "../controllers/geminiController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/summary/:gameId", verifyToken, summarizeGameReviews);
// router.post("/summary/:gameId", summarizeGameReviews);
router.get("/objects", getGeneratedGames);
router.get("/objects/search", getGamesByType);
router.get("/objects/:id", getGeneratedGameById);
// dodamy więcej jak zrobisz next ones

export default router;
