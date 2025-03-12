"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const indexController_1 = require("../controllers/indexController");
const router = (0, express_1.Router)();
router.get("/", indexController_1.homePage);
router.get("/kontakt", (req, res) => {
    res.render("kontakt");
});
exports.default = router;
