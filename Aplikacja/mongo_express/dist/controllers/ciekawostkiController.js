"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCiekawostkiJSON = exports.getAllCiekawostki = void 0;
const ciekawostki_1 = __importDefault(require("../data/ciekawostki"));
// Pobieranie wszystkich ciekawostek
const getAllCiekawostki = (req, res) => {
    console.log(ciekawostki_1.default);
    res.render("ciekawostki", { ciekawostki: ciekawostki_1.default });
};
exports.getAllCiekawostki = getAllCiekawostki;
// Pobieranie w formacie JSON
const getAllCiekawostkiJSON = (req, res) => {
    res.setHeader("Content-Disposition", "attachment; filename=ciekawostki.json");
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(ciekawostki_1.default, null, 2));
};
exports.getAllCiekawostkiJSON = getAllCiekawostkiJSON;
