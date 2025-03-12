"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.homePage = void 0;
const ciekawostki_1 = __importDefault(require("../data/ciekawostki"));
const wynalazki_1 = __importDefault(require("../data/wynalazki"));
const homePage = (req, res) => {
    const randomCiekawostkaIndex = Math.floor(Math.random() * ciekawostki_1.default.length);
    const ciekawostka = ciekawostki_1.default[randomCiekawostkaIndex];
    const randomWynalazki = [];
    while (randomWynalazki.length < 3) {
        const randomIndex = Math.floor(Math.random() * wynalazki_1.default.length);
        const wynalazek = wynalazki_1.default[randomIndex];
        if (!randomWynalazki.includes(wynalazek)) {
            randomWynalazki.push(wynalazek);
        }
    }
    res.render('index', { ciekawostka, wynalazki: randomWynalazki });
};
exports.homePage = homePage;
