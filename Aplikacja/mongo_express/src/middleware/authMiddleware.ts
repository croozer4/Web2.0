import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


// Middleware do weryfikacji tokenu
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
  
    if (!token) {
      res.status(403).json({ message: "Brak tokenu autoryzacyjnego" });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, "secretKey");
      req.user = decoded;  // Przechowujemy dane użytkownika w req.user
      return next();  // Przechodzimy do następnego middleware lub trasy
    } catch (error) {
      res.status(403).json({ message: "Token jest nieprawidłowy" });
      return;
    }
  };
  