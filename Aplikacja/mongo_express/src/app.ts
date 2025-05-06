import express, { Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import gamesRouter from "./routes/games";
import userRouter from "./routes/userRoutes";
import reviewsRouter from "./routes/reviewRoutes";
import adminRoutes from "./routes/adminRoutes";
import geminiRoutes from "./routes/geminiRoutes";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/your_database";

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

app.use("/games", gamesRouter);  // Obsługuje wszystkie trasy związane z grami
app.use("/user", userRouter);  // Obsługuje wszystkie trasy związane z użytkownikami
app.use("/reviews", reviewsRouter);  // Obsługuje wszystkie trasy związane z recenzjami
app.use("/admin", adminRoutes); // Obsługuje wszystkie trasy związane z administracją
app.use("/gemini", geminiRoutes); // Obsługuje wszystkie trasy związane z Gemini

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
