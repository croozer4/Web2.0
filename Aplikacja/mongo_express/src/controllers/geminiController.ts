// src/controllers/geminiController.ts
import { Request, Response } from "express";
import Review from "../models/Review";
import Game from "../models/Game";
import { model } from "../utils/gemini";

let generatedGamesCache: any[] = [];

const generatePrompt = (type?: string) => {
  return `
Wygeneruj listę 10 gier wideo ${type ? `typu "${type}"` : ""}. Dla każdej gry podaj dane w formacie JSON z następującymi polami:
- _id: losowy unikalny identyfikator (np. 24-znakowy hex),
- title: tytuł gry,
- developer: twórca,
- release_year: rok wydania,
- platforms: lista platform (np. ["PC", "PS4", "Xbox One"]),
- genre: lista gatunków (np. ["RPG", "Open World"]),
- rating: ocena od 0.0 do 10.0 (float),
- price: cena w USD (float).

Odpowiedz tylko w formacie JSON, bez żadnych komentarzy ani tekstu dodatkowego.
`;
};

export const getGeneratedGames = async (req: Request, res: Response) => {
  try {
    const prompt = generatePrompt();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();
    const games = JSON.parse(cleaned);
    generatedGamesCache = games;

    res.json(games);
  } catch (err) {
    console.error("Błąd generowania gier:", err);
    res.status(500).json({ message: "Błąd generowania gier" });
  }
};

export const getGeneratedGameById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const index = parseInt(id, 10);

  if (isNaN(index) || index < 0 || index >= generatedGamesCache.length) {
    res.status(404).json({ message: "Gra nie znaleziona" });
    return;
  }

  res.json(generatedGamesCache[index]);
};

export const getGamesByType = async (req: Request, res: Response): Promise<void> => {
  const { type } = req.query;

  if (!type || typeof type !== "string") {
    res.status(400).json({ message: "Brakuje typu gry w query param: typ " + type});
    return;
  }

  try {
    const prompt = generatePrompt(type);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();
    const games = JSON.parse(cleaned);
    res.json(games);
  } catch (err) {
    console.error("Błąd generowania gier po typie:", err);
    res.status(500).json({ message: "Błąd generowania gier" });
  }
};

export const summarizeGameReviews = async (req: Request, res: Response): Promise<void> => {
  const { gameId } = req.params;
  console.log("przekazany game id")

  const reviews = await Review.find({ gameId });

  const combinedReviews = reviews.map((r) => `- ${r.content}`).join("\n");

  console.log("oto opinie: " + combinedReviews);

  const prompt = `
Oto opinie użytkowników o grze:
${combinedReviews}

Napisz krótkie podsumowanie zaczynając od:
"Gracze chwalą tę grę za... Jednocześnie zwracają uwagę na... W ogólnej opinii gra wypada..."

Nie dodawaj wstępów, nagłówków ani zakończeń. Skup się tylko na zwięzłym podsumowaniu w kilku zdaniach. Używaj informacji zawartych wyłącznie w przekazanych opiniach.

`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  res.status(200).json({ summary: text });
};
