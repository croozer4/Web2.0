"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTworca = exports.getTworcaById = exports.getAllTworcy = void 0;
const tworcy_1 = __importDefault(require("../data/tworcy"));
// Pobieranie wszystkich twórców, z opcją sortowania
const getAllTworcy = (req, res) => {
    const { sort, order } = req.query;
    let sortedTworcy = [...tworcy_1.default];
    if (sort === "imie") {
        sortedTworcy.sort((a, b) => a.imie.localeCompare(b.imie));
    }
    else if (sort === "nazwisko") {
        sortedTworcy.sort((a, b) => a.nazwisko.localeCompare(b.nazwisko));
    }
    else if (sort === "dataUrodzenia") {
        sortedTworcy.sort((a, b) => new Date(a.dataUrodzenia).getTime() - new Date(b.dataUrodzenia).getTime());
    }
    if (order === "desc") {
        sortedTworcy.reverse();
    }
    res.render("tworcy", { tworcy: sortedTworcy });
};
exports.getAllTworcy = getAllTworcy;
// Pobieranie pojedynczego twórcy po ID
const getTworcaById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const tworca = tworcy_1.default.find(t => t.id === id);
    if (tworca) {
        res.render("tworca", { tworca });
    }
    else {
        res.status(404).send("Twórca nie znaleziony");
    }
};
exports.getTworcaById = getTworcaById;
const obliczWiek = (dataUrodzenia, dataSmierci) => {
    const dzisiaj = dataSmierci ? new Date(dataSmierci) : new Date();
    const dataUr = new Date(dataUrodzenia);
    let wiek = dzisiaj.getFullYear() - dataUr.getFullYear();
    const miesiacRoznica = dzisiaj.getMonth() - dataUr.getMonth();
    const dzienRoznica = dzisiaj.getDate() - dataUr.getDate();
    if (miesiacRoznica < 0 || (miesiacRoznica === 0 && dzienRoznica < 0)) {
        wiek--;
    }
    return wiek;
};
// Dodawanie nowego twórcy
const addTworca = (req, res) => {
    console.log(req.body);
    const { imie, nazwisko, biografia, zdjecie, dataUrodzenia, dataSmierci, narodowosc } = req.body;
    const newTworca = {
        id: tworcy_1.default.length + 1,
        imie,
        nazwisko,
        biografia,
        zdjecie,
        dataUrodzenia,
        dataSmierci,
        narodowosc,
        wiek: obliczWiek(dataUrodzenia, dataSmierci),
    };
    tworcy_1.default.push(newTworca);
    res.redirect("/tworcy");
};
exports.addTworca = addTworca;
