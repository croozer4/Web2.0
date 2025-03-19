import express, { Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import gamesRouter from "./routes/games"; // Nowy router do gier
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/your_database";  // Zmieniamy na zmienną środowiskową
// console.log("🔍 Używany MONGO_URI:", MONGO_URI);
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Połączono z MongoDB"))
  .catch(err => console.error("❌ Błąd połączenia z MongoDB:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware do logowania żądań
app.use((req: Request, res: Response, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Używamy nowych tras gier
app.use("/games", gamesRouter);  // Obsługuje wszystkie trasy związane z grami

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
