import { Request, Response } from "express";
import Game from "../models/Game";

import "express-async-errors";

// GET /games – Pobierz listę wszystkich gier
export const getAllGames = async (req: Request, res: Response): Promise<void> => {
  const { sort, order, genre } = req.query;
  console.log("Aktualnie używana baza:", Game.db.name);
  
  const query = genre ? { genre } : {};
  const sortOptions = getSortOptions(sort as string, order as string);
  
  try {
    const games = await Game.find(query).sort(sortOptions);
    console.log("Pobrane gry:", games);
    res.json(games);
  } catch (error) {
    console.error("Błąd pobierania gier:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

// Funkcja pomocnicza do ustawiania opcji sortowania
const getSortOptions = (sort: string, order: string): Record<string, 1 | -1> => {
  const direction = order === "desc" ? -1 : 1;
  switch (sort) {
    case "name": return { name: direction };
    case "genre": return { genre: direction };
    case "release_year": return { release_year: direction };
    default: return {};
  }
};

// GET /games/{id} – Pobierz szczegóły gry
export const getGameById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const game = await Game.findById(id);
    if (!game) {
      res.status(404).json({ message: "Gra nie znaleziona" });
      return;
    }
    res.json(game);
  } catch (error) {
    console.error("Błąd pobierania gry:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

// POST /games – Dodaj nową grę
export const addGame = async (req: Request, res: Response): Promise<void> => {
  const { title, developer, release_year, platforms, rating, price } = req.body;
  try {
    const newGame = new Game({
      title,
      developer,
      release_year,
      platforms,
      rating,
      price
    });
    await newGame.save();
    res.status(201).json(newGame);
  } catch (error) {
    console.error("Błąd dodawania gry:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

// PUT /games/{id} – Aktualizuj dane gry
export const updateGame = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, developer, release_year, platforms, rating, price } = req.body;
  try {
    const game = await Game.findByIdAndUpdate(
      id,
      { title, developer, release_year, platforms, rating, price },
      { new: true }
    );
    if (!game) {
      res.status(404).json({ message: "Gra nie znaleziona" });
      return;
    }
    res.json({ message: "Gra zaktualizowana", game });
  } catch (error) {
    console.error("Błąd aktualizacji gry:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

// DELETE /games/{id} – Usuń grę
export const deleteGame = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const game = await Game.findByIdAndDelete(id);
    if (!game) {
      res.status(404).json({ message: "Gra nie znaleziona" });
      return;
    }
    res.json({ message: "Gra usunięta" });
  } catch (error) {
    console.error("Błąd usuwania gry:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};
