import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

// 1. Dodawanie użytkownika
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email } = req.body;
  const password = Math.random().toString(36).slice(-8); // losowe hasło

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    isActive: true,
    isAdmin: false,
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
  
    //   const activationLink = `http://localhost:3000/user/activate/${newUser._id}`;
  
      const mailOptions = {
        from: "your-email@gmail.com",
        to: newUser.email,
        subject: "Utworzenie konta",
        text: `Witaj na ten adres email utworzono dla Ciebie konto którego hasło to ${password}`,
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

  res.status(201).json({ message: "Użytkownik utworzony", password }); // możesz też zwrócić hasło tymczasowe
};

// 2. Usuwanie użytkownika
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);
  res.status(200).json({ message: "Użytkownik usunięty" });
};

// 3. Toggle admin
export const toggleAdmin = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({ message: "Nie znaleziono użytkownika" });
    return;
  }

  user.isAdmin = !user.isAdmin;
  await user.save();

  res
    .status(200)
    .json({
      message: `Uprawnienia administratora ${
        user.isAdmin ? "dodane" : "usunięte"
      }`,
    });
};

// 4. Toggle aktywność
export const toggleActive = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({ message: "Nie znaleziono użytkownika" });
    return;
  }

  user.isActive = !user.isActive;
  await user.save();

  res
    .status(200)
    .json({
      message: `Konto zostało ${user.isActive ? "aktywowane" : "zablokowane"}`,
    });
};
