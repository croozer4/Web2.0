import { Request, Response } from "express";
import Wynalazek from "../models/Wynalazek";
import Tworca from "../models/Tworca";

import "express-async-errors";

import { validateWynalazek } from "../utils/validator";

export const getAllWynalazki = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { sort, order } = req.query;

  const sortOptions = getSortOptions(sort as string, order as string);

  try {
    const wynalazki = await Wynalazek.find()
      .populate({
        path: "twórca_id",
        select: "imie nazwisko",
      })
      .sort(sortOptions)
      .lean();

    console.log("Poprawne dane:", JSON.stringify(wynalazki, null, 2));
    res.render("wynalazki", { wynalazki });
  } catch (error) {
    console.error("Błąd pobierania:", error);
    res.status(500).send("Błąd serwera");
  }
};

export const getWynalazekById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const wynalazek = await Wynalazek.findById(req.params.id).populate(
    "tworca_id"
  );
  if (!wynalazek) throw new Error("Wynalazek nie znaleziony");
  res.render("wynalazek", { wynalazek });
};

export const addWynalazek = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const czy_używany = req.body.czy_używany === "on";

    console.log("Checkbox value:", req.body.czy_używany);
    console.log("Converted value:", czy_używany);

    const nowyWynalazek = new Wynalazek({
      ...req.body,
      czy_używany: czy_używany,
      historia: {
        pierwsze_publiczne_demonstracje: Number(
          req.body.pierwsze_publiczne_demonstracje
        ),
        wprowadzenie_na_rynek: Number(req.body.wprowadzenie_na_rynek),
      },
    });

    if (!validateWynalazek(nowyWynalazek)) {
      const errors = validateWynalazek.errors?.map((err) =>
        `${err.instancePath} ${err.message}`.trim()
      );
      return res.status(400).render("addWynalazek", {
        tworcy: await Tworca.find().lean(),
        errors,
        formData: req.body,
      });
    }

    await nowyWynalazek.save();
    res.redirect("/wynalazki");
  } catch (error) {
    console.error("Błąd dodawania wynalazku:", error);
    res.status(500).send("Błąd serwera");
  }
};

export const updateWynalazek = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    nazwa,
    rok,
    tworca_id,
    czy_używany,
    zastosowania,
    pierwsze_publiczne_demonstracje,
    wprowadzenie_na_rynek,
  } = req.body;

  const updatedWynalazek = await Wynalazek.findByIdAndUpdate(
    req.params.id,
    {
      nazwa,
      rok,
      tworca_id,
      czy_używany: czy_używany === "on",
      zastosowania: zastosowania
        ? zastosowania.split(",").map((s: string) => s.trim())
        : [],
      historia: {
        pierwsze_publiczne_demonstracje: Number(
          pierwsze_publiczne_demonstracje
        ),
        wprowadzenie_na_rynek: Number(wprowadzenie_na_rynek),
      },
    },
    { new: true }
  );

  if (!updatedWynalazek) throw new Error("Błąd aktualizacji");
  res.redirect(`/wynalazki/${req.params.id}`);
};

export const deleteWynalazek = async (
  req: Request,
  res: Response
): Promise<void> => {
  await Wynalazek.findByIdAndDelete(req.params.id);
  res.redirect("/wynalazki");
};

const getSortOptions = (
  sort: string,
  order: string
): Record<string, 1 | -1> => {
  const direction = order === "desc" ? -1 : 1;
  switch (sort) {
    case "nazwa":
      return { nazwa: direction };
    case "rok":
      return { rok: direction };
    default:
      return {};
  }
};
