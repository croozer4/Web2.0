import express from "express";
import {
    getAllTworcy,
    getTworcaById,
    addTworca,
    updateTworca,
    deleteTworca
} from "../controllers/tworcyController";
import Tworca from "../models/Tworca";

const router = express.Router();

router.get("/tworcy", (req, res) => getAllTworcy(req, res));
router.post("/tworcy/add", (req, res) => addTworca(req, res));

router.get("/tworcy/add", (req, res) => {
    res.render("addTworca");
});

router.get("/tworcy/:id", (req, res) => getTworcaById(req, res));
router.put("/tworcy/:id", (req, res) => updateTworca(req, res));
router.delete("/tworcy/:id", (req, res) => deleteTworca(req, res));

router.get("/tworcy/edit/:id", async (req, res) => {
    try {
        const tworca = await Tworca.findById(req.params.id);
        res.render("editTworca", { tworca });
    } catch (err) {
        res.status(500).send("Błąd pobierania twórcy");
    }
});

export default router;