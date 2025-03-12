import { Request, Response } from 'express';
import Wynalazek from '../models/Wynalazek';
import Tworca from '../models/Tworca';

export const homePage = async (req: Request, res: Response): Promise<void> => {
  try {
    const wynalazki = await Wynalazek.aggregate([
      { $sample: { size: 3 } },
      { $project: { 
        nazwa: 1, 
        rok: 1, 
        zastosowania: 1, 
        czy_używany: 1 
      }}
    ]);

    const tworca = await Tworca.aggregate([
      { $sample: { size: 1 } },
      { $project: {
        imie: 1,
        nazwisko: 1,
        narodowosc: 1,
        bioSnippet: { $substrCP: ["$biografia", 0, 150] }
      }}
    ]);

    res.render('index', {
      wynalazki,
      tworca: tworca[0] || null
    });
  } catch (error) {
    console.error('Błąd pobierania danych:', error);
    res.status(500).send('Błąd serwera');
  }
};