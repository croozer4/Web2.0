"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tworcyController_1 = require("../controllers/tworcyController");
const router = express_1.default.Router();
router.get("/tworcy", tworcyController_1.getAllTworcy);
router.get("/tworcy/add", (req, res) => {
    res.render("addTworca");
});
router.post("/tworcy/add", tworcyController_1.addTworca);
router.get("/tworcy/:id", tworcyController_1.getTworcaById);
exports.default = router;
