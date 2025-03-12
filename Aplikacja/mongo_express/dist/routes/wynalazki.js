"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wynalazkiController_1 = require("../controllers/wynalazkiController");
const router = express_1.default.Router();
router.get("/wynalazki", wynalazkiController_1.getAllWynalazki);
router.get("/wynalazki/add", (req, res) => {
    res.render("addWynalazek");
});
router.post("/wynalazki/add", wynalazkiController_1.addWynalazek);
router.get("/wynalazki/:id", wynalazkiController_1.getWynalazekById);
exports.default = router;
