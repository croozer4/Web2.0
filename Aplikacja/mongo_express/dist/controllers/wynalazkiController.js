"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWynalazek = exports.getWynalazekById = exports.getAllWynalazki = void 0;
const wynalazki_1 = __importDefault(require("../data/wynalazki"));
// Pobieranie wszystkich wynalazków, z opcją sortowania
const getAllWynalazki = (req, res) => {
    const { sort, order } = req.query;
    let sortedWynalazki = [...wynalazki_1.default];
    if (sort === "nazwa") {
        sortedWynalazki.sort((a, b) => a.nazwa.localeCompare(b.nazwa));
    }
    else if (sort === "tworca") {
        sortedWynalazki.sort((a, b) => a.tworca.localeCompare(b.tworca));
    }
    else if (sort === "rok") {
        sortedWynalazki.sort((a, b) => a.rok - b.rok);
    }
    if (order === "desc") {
        sortedWynalazki.reverse();
    }
    res.render("wynalazki", { wynalazki: sortedWynalazki });
};
exports.getAllWynalazki = getAllWynalazki;
// Pobieranie pojedynczego wynalazku po ID
const getWynalazekById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const wynalazek = wynalazki_1.default.find(w => w.id === id);
    if (wynalazek) {
        res.render("wynalazek", { wynalazek });
    }
    else {
        res.status(404).send("Wynalazek nie znaleziony");
    }
};
exports.getWynalazekById = getWynalazekById;
// Dodawanie nowego wynalazku
const addWynalazek = (req, res) => {
    console.log(req.body);
    const { nazwa, tworca, opis, zdjecie, rok, kategoria, opatentowany } = req.body;
    const newWynalazek = {
        id: wynalazki_1.default.length + 1,
        nazwa,
        tworca,
        opis,
        zdjecie,
        rok,
        kategoria,
        opatentowany: opatentowany === 'true' || opatentowany === true // Konwersja na boolean, jeśli przychodzi jako string
    };
    wynalazki_1.default.push(newWynalazek);
    res.redirect("/wynalazki");
};
exports.addWynalazek = addWynalazek;
