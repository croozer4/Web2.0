// src/routes/geminiRoutes.ts
import express from "express";
import { summarizeGameReviews } from "../controllers/geminiController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/summary/:gameId", verifyToken, summarizeGameReviews);
// dodamy więcej jak zrobisz next ones

export default router;
