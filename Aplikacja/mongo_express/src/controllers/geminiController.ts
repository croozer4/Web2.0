// src/controllers/geminiController.ts
import { Request, Response } from "express";
import Review from "../models/Review";
import Game from "../models/Game";
import { model } from "../utils/gemini";

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
