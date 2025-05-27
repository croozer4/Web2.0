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
      subject: "Witamy w RatePlay! Aktywacja konta",
      html: `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Aktywacja Konta RatePlay</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #eeeeee;
            }
            .header h1 {
                color: #333333;
                font-size: 24px;
                margin: 0;
            }
            .content {
                padding: 20px 0;
            }
            .content p {
                margin-bottom: 15px;
            }
            .activation-code {
                display: block;
                width: fit-content;
                margin: 20px auto;
                padding: 15px 25px;
                background-color: #4dbef7; /* Kolor przycisku z DaisyUI primary */
                color: #ffffff;
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                border-radius: 5px;
                text-decoration: none;
                letter-spacing: 2px;
            }
            .footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #eeeeee;
                font-size: 14px;
                color: #777777;
            }
            .logo {
                max-width: 150px; /* Dostosuj rozmiar, jeśli masz logo */
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Witamy w RatePlay!</h1>
            </div>
            <div class="content">
                <p>Cześć <b>${newUser.username}</b>,</p>
                <p>Dziękujemy za rejestrację konta w serwisie RatePlay! Jesteśmy podekscytowani, że dołączasz do naszej społeczności graczy.</p>
                <p>Aby dokończyć proces rejestracji i aktywować swoje konto, prosimy o wpisanie poniższego kodu aktywacyjnego na naszej stronie:</p>
                <span class="activation-code">${activationCode}</span>
                <p>Ten kod jest niezbędny do pełnego dostępu do wszystkich funkcji RatePlay.</p>
                <p>Jeśli nie rejestrowałeś się w RatePlay, prosimy zignoruj tę wiadomość.</p>
            </div>
            <div class="footer">
                <p>Dziękujemy i pozdrawiamy,</p>
                <p>Zespół RatePlay</p>
            </div>
        </div>
    </body>
    </html>
  `,
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

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
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

export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
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

export const requestPasswordReset = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(404)
        .json({ message: "Nie znaleziono użytkownika z takim e-mailem" });
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

      res
        .status(200)
        .json({ message: "Kod resetujący hasło został wysłany na e-mail" });
    });
  } catch (error) {
    console.error("Błąd przy żądaniu resetu hasła:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, resetCode, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    res.status(400).json({ message: "Hasła nie są zgodne." });
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user || user.resetCode !== resetCode) {
      res
        .status(400)
        .json({ message: "Nieprawidłowy kod resetujący lub użytkownik." });
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
