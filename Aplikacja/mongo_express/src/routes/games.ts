import express from "express";
import { getAllGames, getGameById, addGame, updateGame, deleteGame } from "../controllers/gamesController";

const router = express.Router();

// GET /games – Pobierz listę wszystkich gier
router.get("/", getAllGames);

// GET /games/{id} – Pobierz szczegóły gry
router.get("/:id", getGameById);

// POST /games – Dodaj nową grę
router.post("/", addGame);

// PUT /games/{id} – Aktualizuj dane gry
router.put("/:id", updateGame);

// DELETE /games/{id} – Usuń grę
router.delete("/:id", deleteGame);

export default router;
