import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(403).json({ message: "Brak tokena autoryzacyjnego" });
    }

    const decoded = jwt.verify(token, "secretKey") as { userId: string };

    const user = await User.findById(decoded.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Brak uprawnień administratora" });
    }

    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Błąd autoryzacji administratora" });
  }
};
