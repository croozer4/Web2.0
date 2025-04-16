import express from "express";
import { createUser, deleteUser, toggleAdmin, toggleActive } from "../controllers/adminController";
import { verifyToken } from "../middleware/authMiddleware";
import { verifyAdmin } from "../middleware/verifyAdmin";

const router = express.Router();

// router.use(verifyToken, verifyAdmin); // <--- chroni cały panel admina

router.post("/users", verifyToken, createUser); // dodaj usera
router.delete("/users/:id", verifyToken, deleteUser); // usuń usera
router.patch("/users/:id/toggle-admin", verifyToken, toggleAdmin); // dodaj/usuń admina
router.patch("/users/:id/toggle-active", verifyToken, toggleActive); // aktywuj/dezaktywuj

export default router;
