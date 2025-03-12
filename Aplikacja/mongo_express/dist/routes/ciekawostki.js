"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ciekawostkiController_1 = require("../controllers/ciekawostkiController");
const router = express_1.default.Router();
router.get("/ciekawostki", ciekawostkiController_1.getAllCiekawostki);
router.get("/ciekawostki/json", ciekawostkiController_1.getAllCiekawostkiJSON);
exports.default = router;
