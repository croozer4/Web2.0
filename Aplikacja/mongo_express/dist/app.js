"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const games_1 = __importDefault(require("./routes/games"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const geminiRoutes_1 = __importDefault(require("./routes/geminiRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/your_database";
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log("✅ Połączono z MongoDB"))
    .catch(err => console.error("❌ Błąd połączenia z MongoDB:", err));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Middleware do logowania żądań
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use("/games", games_1.default); // Obsługuje wszystkie trasy związane z grami
app.use("/user", userRoutes_1.default); // Obsługuje wszystkie trasy związane z użytkownikami
app.use("/reviews", reviewRoutes_1.default); // Obsługuje wszystkie trasy związane z recenzjami
app.use("/admin", adminRoutes_1.default); // Obsługuje wszystkie trasy związane z administracją
app.use("/gemini", geminiRoutes_1.default); // Obsługuje wszystkie trasy związane z Gemini
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
