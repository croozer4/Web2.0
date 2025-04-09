// src/types/express.d.ts
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };  // Rozszerzenie o userId
      params: { [key: string]: string };  // Dodanie params
      body: any;  // Typowanie body
      query: { [key: string]: string | string[] };  // Typowanie query (opcjonalne)
    }
  }
}
