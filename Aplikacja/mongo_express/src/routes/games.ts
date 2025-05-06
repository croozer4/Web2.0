import express from "express";
import { getAllGames, getGameById, addGame, updateGame, deleteGame } from "../controllers/gamesController";

const router = express.Router();

router.get("/", getAllGames);
router.get("/:id", getGameById);
router.post("/", addGame);
router.put("/:id", updateGame);
router.delete("/:id", deleteGame);

export default router;
