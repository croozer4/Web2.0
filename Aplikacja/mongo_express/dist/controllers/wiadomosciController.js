"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWiadomosc = exports.getAllWiadomosci = void 0;
const wiadomosci_1 = __importDefault(require("../data/wiadomosci"));
// Pobieranie wszystkich wiadomości
const getAllWiadomosci = (req, res) => {
    res.render("wiadomosci", { wiadomosci: wiadomosci_1.default });
};
exports.getAllWiadomosci = getAllWiadomosci;
// Dodawanie nowej wiadomości
const addWiadomosc = (req, res) => {
    console.log(req.body);
    const { nick, tresc } = req.body;
    const nowaData = new Date();
    const data = `${nowaData.getDate()}/${nowaData.getMonth() + 1}/${nowaData.getFullYear()} ${nowaData.getHours()}:${nowaData.getMinutes()}:${nowaData.getSeconds()}`;
    const newWiadomosc = {
        id: wiadomosci_1.default.length + 1,
        nick,
        tresc,
        data
    };
    wiadomosci_1.default.push(newWiadomosc);
    res.render("wiadomosci", { wiadomosci: wiadomosci_1.default });
};
exports.addWiadomosc = addWiadomosc;
