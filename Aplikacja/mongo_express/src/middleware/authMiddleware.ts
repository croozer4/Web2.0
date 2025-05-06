import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Czarna lista tokenów
const blacklistedTokens = new Set<string>();

// Middleware do weryfikacji tokenu
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
  
    if (!token) {
      res.status(403).json({ message: "Brak tokenu autoryzacyjnego" });
      return;
    }

    if (blacklistedTokens.has(token)) {
      res.status(403).json({ message: "Token został unieważniony (wylogowanie)" });
      return;
    }
    
    try {
      const decoded = jwt.verify(token, "secretKey");
      (req as any).user = decoded;
      next();
    } catch (error) {
      res.status(403).json({ message: "Token jest nieprawidłowy" });
    }
  };
  

// Funkcja do dodawania tokenu do czarnej listy
export const blacklistToken = (token: string) => {
    blacklistedTokens.add(token);
};
