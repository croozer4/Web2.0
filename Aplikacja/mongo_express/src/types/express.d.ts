// src/types/express.d.ts
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any; // Możesz dostosować ten typ, w zależności od tego, co zawiera 'decoded'
    }
  }
}
