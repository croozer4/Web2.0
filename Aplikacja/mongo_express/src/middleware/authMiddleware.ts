import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Middleware do weryfikacji tokenu
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
  
    if (!token) {
      return res.status(403).json({ message: "Brak tokenu autoryzacyjnego" });
    }
  
    try {
      const decoded = jwt.verify(token, "secretKey");
      req.user = decoded;  // Przechowujemy dane użytkownika w req.user
      next();  // Przechodzimy do następnego middleware lub trasy
    } catch (error) {
      return res.status(403).json({ message: "Token jest nieprawidłowy" });
    }
  };
  