import { Request, Response } from "express";
import Tworca from "../models/Tworca";

import "express-async-errors";

export const getAllTworcy = async (req: Request, res: Response): Promise<void> => {
    const { sort, order, narodowosc } = req.query;
    console.log("Aktualnie używana baza:", Tworca.db.name);
    
    const query = narodowosc ? { narodowosc } : {};
    const sortOptions = getSortOptions(sort as string, order as string);
    
    const tworcy = await Tworca.find(query).sort(sortOptions);
    console.log("pobrani tworcy: ", tworcy);
    res.render("tworcy", { tworcy });
};

const getSortOptions = (sort: string, order: string): Record<string, 1 | -1> => {
    const direction = order === "desc" ? -1 : 1;
    switch (sort) {
        case "imie": return { imie: direction };
        case "nazwisko": return { nazwisko: direction };
        case "dataUrodzenia": return { dataUrodzenia: direction };
        default: return {};
    }
};

export const getTworcaById = async (req: Request, res: Response): Promise<void> => {
    const tworca = await Tworca.findById(req.params.id);
    if (!tworca) throw new Error("Twórca nie znaleziony");
    res.render("tworca", { tworca });
};

export const addTworca = async (req: Request, res: Response): Promise<void> => {
    const { imie, nazwisko, zdjecie, biografia, narodowosc, dataUrodzenia, dataSmierci, nobel, inneNagrody } = req.body;
    
    const nowyTworca = new Tworca({
        imie,
        nazwisko,
        zdjecie,
        biografia,
        narodowosc,
        dataUrodzenia,
        dataSmierci,
        wiek: calculateAge(dataUrodzenia, dataSmierci),
        czy_zyje: !dataSmierci,
        nagrody: {
            nobel: nobel === "on",
            inne: inneNagrody ? inneNagrody.split(",").map((n: string) => n.trim()) : []
        }
    });

    await nowyTworca.save();
    res.redirect("/tworcy");
};

export const updateTworca = async (req: Request, res: Response): Promise<void> => {
    const { imie, nazwisko, zdjecie, biografia, narodowosc, dataUrodzenia, dataSmierci, nobel, inneNagrody } = req.body;
    
    const updatedTworca = await Tworca.findByIdAndUpdate(
        req.params.id,
        {
            imie,
            nazwisko,
            zdjecie,
            biografia,
            narodowosc,
            dataUrodzenia,
            dataSmierci,
            wiek: calculateAge(dataUrodzenia, dataSmierci),
            czy_zyje: !dataSmierci,
            nagrody: {
                nobel: nobel === "on",
                inne: inneNagrody ? inneNagrody.split(",").map((n: string) => n.trim()) : []
            }
        },
        { new: true }
    );

    if (!updatedTworca) throw new Error("Błąd aktualizacji");
    res.redirect(`/tworcy/${req.params.id}`);
};


export const deleteTworca = async (req: Request, res: Response): Promise<void> => {
    await Tworca.findByIdAndDelete(req.params.id);
    res.redirect("/tworcy");
};

const calculateAge = (birthDate: string, deathDate?: string): number => {
    const endDate = deathDate ? new Date(deathDate) : new Date();
    const diff = endDate.getTime() - new Date(birthDate).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};