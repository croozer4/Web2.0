import { Request, Response } from "express";
import Game from "../models/Game";

import "express-async-errors";

// GET /games – Pobierz listę wszystkich gier
export const getAllGames = async (req: Request, res: Response): Promise<void> => {
  const { sort, order, genre } = req.query;
  console.log("Aktualnie używana baza:", Game.db.name);
  
  const query = genre ? { genre } : {};  // Filtrujemy po gatunku, jeśli podano
  const sortOptions = getSortOptions(sort as string, order as string);  // Sortowanie gier
  
  try {
    const games = await Game.find(query).sort(sortOptions);
    console.log("Pobrane gry:", games);
    res.render("games", { games });  // Renderowanie strony gier
  } catch (error) {
    console.error("Błąd pobierania gier:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

// Funkcja pomocnicza do ustawiania opcji sortowania
const getSortOptions = (sort: string, order: string): Record<string, 1 | -1> => {
  const direction = order === "desc" ? -1 : 1;
  switch (sort) {
    case "name": return { name: direction };  // Sortowanie po nazwie
    case "genre": return { genre: direction };  // Sortowanie po gatunku
    case "releaseDate": return { releaseDate: direction };  // Sortowanie po dacie wydania
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
    res.render("game", { game });  // Renderowanie szczegółów gry
  } catch (error) {
    console.error("Błąd pobierania gry:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

// POST /games – Dodaj nową grę
export const addGame = async (req: Request, res: Response): Promise<void> => {
  const { name, genre, platform, releaseDate, description } = req.body;
  try {
    const newGame = new Game({
      name,
      genre,
      platform,
      releaseDate,
      description
    });
    await newGame.save();
    res.redirect("/games");  // Przekierowanie do listy gier
  } catch (error) {
    console.error("Błąd dodawania gry:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

// PUT /games/{id} – Aktualizuj dane gry
export const updateGame = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, genre, platform, releaseDate, description } = req.body;
  try {
    const game = await Game.findByIdAndUpdate(
      id,
      { name, genre, platform, releaseDate, description },
      { new: true }
    );
    if (!game) {
      res.status(404).json({ message: "Gra nie znaleziona" });
      return;
    }
    res.redirect(`/games/${id}`);  // Przekierowanie do strony z aktualizowaną grą
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
    res.redirect("/games");  // Przekierowanie do listy gier
  } catch (error) {
    console.error("Błąd usuwania gry:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};
