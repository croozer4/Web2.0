import express, { Request, Response } from "express";
import {
  getAllWynalazki,
  getWynalazekById,
  updateWynalazek,
  deleteWynalazek,
} from "../controllers/wynalazkiController";
import Wynalazek from "../models/Wynalazek";
import Tworca from '../models/Tworca';
import mongoose from 'mongoose';
import { validateWynalazek } from '../utils/validator';

const router = express.Router();

// Middleware
router.use(express.urlencoded({ extended: true }));

// Typ dla danych formularza
interface WynalazekFormData {
  nazwa: string;
  rok: string;
  twórca_id: string;
  czy_używany?: string;
  zastosowania?: string;
  pierwsze_publiczne_demonstracje: string;
  wprowadzenie_na_rynek: string;
}

// Routes
router.get("/wynalazki", getAllWynalazki);

router.get('/wynalazki/add', async (req: Request, res: Response) => {
  try {
    const tworcy = await Tworca.find().lean();
    res.render('addWynalazek', { 
      tworcy,
      errors: [],
      formData: {}
    });
  } catch (error) {
    console.error('Błąd pobierania twórców:', error);
    res.status(500).send('Błąd serwera');
  }
});

router.post('/wynalazki/add', async (req: Request<{}, {}, WynalazekFormData>, res: Response) => {
  try {
    const body = req.body;
    const rawData = {
      ...body,
      twórca_id: body.twórca_id.trim(),
      zastosowania: body.zastosowania || ""
    };

    if (!mongoose.Types.ObjectId.isValid(rawData.twórca_id)) {
      const tworcy = await Tworca.find().lean();
      return res.status(400).render('addWynalazek', {
        tworcy,
        errors: ['Nieprawidłowy format ID twórcy'],
        formData: body
      });
    }

    const validationData = {
      nazwa: rawData.nazwa,
      rok: Number(rawData.rok),
      twórca_id: rawData.twórca_id,
      czy_używany: body.czy_używany === 'on',
      zastosowania: rawData.zastosowania.split(',').map(z => z.trim()),
      historia: {
        pierwsze_publiczne_demonstracje: Number(body.pierwsze_publiczne_demonstracje),
        wprowadzenie_na_rynek: Number(body.wprowadzenie_na_rynek)
      }
    };

    if (!validateWynalazek(validationData)) {
      const errors = validateWynalazek.errors?.map(err => 
        `${err.instancePath} ${err.message}`.replace('/', '') || 'Nieznany błąd'
      ) || ['Nieznany błąd walidacji'];
      
      const tworcy = await Tworca.find().lean();
      return res.status(400).render('addWynalazek', {
        tworcy,
        errors,
        formData: body
      });
    }

    const nowyWynalazek = new Wynalazek(validationData);
    await nowyWynalazek.save();
    res.redirect('/wynalazki');

  } catch (error) {
    console.error('Błąd:', error);
    const tworcy = await Tworca.find().lean();
    res.status(500).render('addWynalazek', {
      tworcy,
      errors: ['Błąd serwera'],
      formData: req.body
    });
  }
});

export default router;