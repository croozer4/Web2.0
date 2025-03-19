import { Router } from "express";
import { registerUser, loginUser, activateAccount } from "../controllers/userController";
import { verifyToken } from "../middleware/authMiddleware";  // Importujemy middleware

const router = Router();

// Rejestracja użytkownika (brak potrzeby tokenu)
router.post("/register", registerUser);

// Logowanie użytkownika (brak potrzeby tokenu)
router.post("/login", loginUser);

// Aktywacja konta (brak potrzeby tokenu)
router.get("/activate/:userId", activateAccount);

// Zabezpieczony endpoint – wymagający tokenu
router.put("/update-profile", verifyToken, (req, res) => {
    // Endpoint, który wymaga tokenu do edycji danych
    // Przykład: edytowanie profilu użytkownika
    res.status(200).json({ message: "Dane zostały zaktualizowane!" });
  });

export default router;
