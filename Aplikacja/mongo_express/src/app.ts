import express, { Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import indexRouter from "./routes/index";
import wynalazkiRouter from "./routes/wynalazki";
import tworcyRouter from "./routes/tworcy";

const app = express();
const PORT = process.env.PORT || 3000;

const MONGO_URI = "mongodb+srv://konradkul12:Vn2lBF2Ytwut8Np3@bazawynalazki.c4rje.mongodb.net/projekt?retryWrites=true&w=majority&appName=BazaWynalazki";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Połączono z MongoDB"))
  .catch(err => console.error("❌ Błąd połączenia z MongoDB:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use((req: Request, res: Response, next) => {
  res.locals.currentPath = req.path;
  console.log(`${req.method} ${req.url}`);
  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/", wynalazkiRouter);
app.use("/", tworcyRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
