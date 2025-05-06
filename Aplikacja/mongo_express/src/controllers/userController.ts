import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/User";
import { blacklistToken } from "../middleware/authMiddleware";

// Generowanie kodu aktywacji
const generateActivationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Funkcja do rejestracji użytkownika
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res
        .status(400)
        .json({ message: "Użytkownik z tym adresem e-mail już istnieje." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const activationCode = generateActivationCode();

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isActive: false,
      activationCode,
    });

    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: "Kod aktywacyjny konta",
      text: `Twój kod aktywacyjny to: ${activationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Błąd e-maila:", error);
        res.status(500).json({ message: "Błąd wysyłki e-maila." });
      } else {
        res.status(201).json({
          message:
            "Użytkownik zarejestrowany. Sprawdź skrzynkę pocztową, aby aktywować konto kodem.",
        });
      }
    });
  } catch (error) {
    console.error("Błąd rejestracji użytkownika:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

// Funkcja do aktywacji konta
export const activateAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "Użytkownik nie znaleziony." });
      return;
    }

    if (user.isActive) {
      res.status(400).json({ message: "Konto jest już aktywne." });
      return;
    }

    if (user.activationCode !== code) {
      res.status(400).json({ message: "Nieprawidłowy kod aktywacyjny." });
      return;
    }

    user.isActive = true;
    user.activationCode = undefined;
    await user.save();

    res.status(200).json({ message: "Konto zostało aktywowane!" });
  } catch (error) {
    console.error("Błąd aktywacji konta:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};


import jwt from "jsonwebtoken";

// Funkcja logowania i generowania tokenu
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Sprawdzamy, czy użytkownik istnieje
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "Użytkownik nie znaleziony" });
      return;
    }

    // Sprawdzamy, czy hasło jest poprawne
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Nieprawidłowe hasło" });
      return;
    }

    // Sprawdzamy, czy konto jest aktywowane
    if (!user.isActive) {
      res.status(403).json({ message: "Konto nie zostało aktywowane" });
      return;
    }

    // Generujemy token JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      "secretKey",
      { expiresIn: "15m" }
    );

    res.status(200).json({ message: "Zalogowano pomyślnie", token });
  } catch (error) {
    console.error("Błąd logowania:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};


export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(400).json({ message: "Brak tokena w żądaniu" });
      return;
    }

    blacklistToken(token);
    res.status(200).json({ message: "Wylogowano pomyślnie" });
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera podczas wylogowywania" });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const { newPassword, confirmPassword } = req.body;
  const userId = (req as any).user?.userId; // zakładamy, że `verifyToken` dołącza `userId` do `req.user`

  if (!userId) {
    res.status(401).json({ message: "Nieautoryzowany dostęp" });
    return;
  }

  if (newPassword !== confirmPassword) {
    res.status(400).json({ message: "Hasła nie są takie same." });
    return;
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "Użytkownik nie znaleziony" });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: "Hasło zostało zmienione pomyślnie" });
  } catch (error) {
    console.error("Błąd zmiany hasła:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "Nie znaleziono użytkownika z takim e-mailem" });
      return;
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Resetowanie hasła",
      text: `Twój kod do zresetowania hasła to: ${resetCode}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Błąd e-maila:", error);
        res.status(500).json({ message: "Błąd podczas wysyłania wiadomości" });
        return;
      }

      res.status(200).json({ message: "Kod resetujący hasło został wysłany na e-mail" });
    });
  } catch (error) {
    console.error("Błąd przy żądaniu resetu hasła:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, resetCode, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    res.status(400).json({ message: "Hasła nie są zgodne." });
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user || user.resetCode !== resetCode) {
      res.status(400).json({ message: "Nieprawidłowy kod resetujący lub użytkownik." });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetCode = undefined;
    await user.save();

    res.status(200).json({ message: "Hasło zostało zresetowane" });
  } catch (error) {
    console.error("Błąd resetowania hasła:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};



