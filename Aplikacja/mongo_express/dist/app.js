"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("./routes/index"));
const wynalazki_1 = __importDefault(require("./routes/wynalazki"));
const ciekawostki_1 = __importDefault(require("./routes/ciekawostki"));
const tworcy_1 = __importDefault(require("./routes/tworcy"));
const wiadomosci_1 = __importDefault(require("./routes/wiadomosci"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/", index_1.default);
app.use("/", wynalazki_1.default);
app.use("/", ciekawostki_1.default);
app.use("/", tworcy_1.default);
app.use("/", wiadomosci_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
