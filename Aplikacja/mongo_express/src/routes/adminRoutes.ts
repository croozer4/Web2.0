import express from "express";
import { createUser, deleteUser, toggleAdmin, toggleActive, getAllUsers } from "../controllers/adminController";
import { verifyToken } from "../middleware/authMiddleware";
import { verifyAdmin } from "../middleware/verifyAdmin";

const router = express.Router();


router.post("/users", verifyToken, createUser);
router.delete("/users/:id", verifyToken, deleteUser);
router.patch("/users/:id/toggle-admin", verifyToken, toggleAdmin);
router.patch("/users/:id/toggle-active", verifyToken, toggleActive);
router.get("/users", verifyToken, verifyAdmin, getAllUsers);

export default router;
