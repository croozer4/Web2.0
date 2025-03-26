import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/User"; // Importujemy model użytkownika

// Funkcja do rejestracji użytkownika
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    // Sprawdzamy, czy użytkownik już istnieje
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res
        .status(400)
        .json({ message: "Użytkownik z tym adresem e-mail już istnieje." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isActive: false,
    });

    await newUser.save();

    // Wysyłanie e-maila z linkiem aktywacyjnym
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);

    const activationLink = `http://localhost:3000/user/activate/${newUser._id}`;

    const mailOptions = {
      from: "your-email@gmail.com",
      to: newUser.email,
      subject: "Aktywacja konta",
      text: `Kliknij w link, aby aktywować swoje konto: ${activationLink}`,
    };

    // Wysyłanie maila
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ message: "Błąd podczas wysyłania wiadomości e-mail." });
      }
      res
        .status(201)
        .json({
          message:
            "Użytkownik zarejestrowany. Sprawdź swoją skrzynkę pocztową, aby aktywować konto.",
        });
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
  const { userId } = req.params;

  try {
    // Znajdź użytkownika w bazie po ID
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "Użytkownik nie znaleziony." });
      return;
    }

    // Aktywuj konto
    user.isActive = true;
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
      "secretKey", // Klucz do podpisywania JWT
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Zalogowano pomyślnie", token });
  } catch (error) {
    console.error("Błąd logowania:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};
