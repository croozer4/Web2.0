import { Router } from "express";
import { registerUser, loginUser, activateAccount, logoutUser, changePassword, requestPasswordReset, resetPassword } from "../controllers/userController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/activate", activateAccount);
router.post("/logout", verifyToken, logoutUser);
router.post("/change-password", verifyToken, changePassword);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);


export default router;
