import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
      params: { [key: string]: string };
      body: any;
      query: { [key: string]: string | string[] };
    }
  }
}
