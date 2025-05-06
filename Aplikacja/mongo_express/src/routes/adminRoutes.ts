import express from "express";
import { createUser, deleteUser, toggleAdmin, toggleActive } from "../controllers/adminController";
import { verifyToken } from "../middleware/authMiddleware";
import { verifyAdmin } from "../middleware/verifyAdmin";

const router = express.Router();


router.post("/users", verifyToken, createUser);
router.delete("/users/:id", verifyToken, deleteUser);
router.patch("/users/:id/toggle-admin", verifyToken, toggleAdmin);
router.patch("/users/:id/toggle-active", verifyToken, toggleActive);

export default router;
