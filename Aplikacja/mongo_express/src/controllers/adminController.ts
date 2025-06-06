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
    isActive: true, // Zakładamy, że konto jest aktywne od razu po utworzeniu przez admina
    isAdmin: false,
  });

  try { // Dodaj try-catch, żeby obsłużyć błędy zapisu użytkownika do bazy
    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);

    const mailOptions = {
      from: process.env.EMAIL_USER, // Użyj zmiennej środowiskowej
      to: newUser.email,
      subject: "Witamy w naszym serwisie! Twoje konto zostało utworzone",
      html: `
        <!DOCTYPE html>
        <html lang="pl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Twoje Konto Zostało Utworzone</title>
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
                .generated-password {
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
                    <h1>Witaj! Twoje konto zostało utworzone.</h1>
                </div>
                <div class="content">
                    <p>Cześć <b>${newUser.username}</b>,</p>
                    <p>Twoje konto w naszym serwisie zostało pomyślnie utworzone! Poniżej znajdziesz swoje tymczasowe hasło:</p>
                    <span class="generated-password">${password}</span>
                    <p>Ze względów bezpieczeństwa, zalecamy zmianę tego hasła po pierwszym logowaniu.</p>
                    <p>Aby się zalogować, użyj swojego adresu e-mail: <b>${newUser.email}</b> oraz powyższego hasła.</p>
                    <p>Jeśli masz jakiekolwiek pytania, skontaktuj się z nami.</p>
                    <p>Jeśli nie tworzyłeś tego konta, prosimy zignoruj tę wiadomość.</p>
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
        console.log(error);
        // Jeśli jest błąd wysyłki maila, to nadal zwracamy sukces utworzenia użytkownika
        // ale z informacją o problemie z mailem
        return res
          .status(201) // Nadal 201 Created
          .json({
            message: "Użytkownik utworzony, ale wystąpił błąd podczas wysyłania e-maila z hasłem.",
            user: newUser, // Zwracamy utworzonego użytkownika
            generatedPassword: password // Możesz zwrócić hasło tylko na dev dla testów
          });
      }
      res
        .status(201)
        .json({
          message: "Użytkownik utworzony. Hasło zostało wysłane na podany adres e-mail.",
          user: newUser, // Zwracamy utworzonego użytkownika
          generatedPassword: password // Możesz zwrócić hasło tylko na dev dla testów
        });
    });
  } catch (error) {
    // Obsługa błędu zapisu użytkownika do bazy danych
    console.error("Błąd podczas tworzenia użytkownika:", error);
    res.status(500).json({ message: "Błąd serwera podczas tworzenia użytkownika." });
  }
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

// NOWA FUNKCJA: Pobieranie wszystkich użytkowników (tylko dla admina)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Pobierz wszystkich użytkowników z bazy danych
    // Możesz wybrać, które pola chcesz zwrócić, aby uniknąć wysyłania hashy haseł itp.
    const users = await User.find({}).select('-password -activationCode -resetCode'); // Wyklucza wrażliwe dane

    res.status(200).json(users);
  } catch (error) {
    console.error("Błąd podczas pobierania użytkowników:", error);
    res.status(500).json({ message: "Błąd serwera podczas pobierania użytkowników." });
  }
};

