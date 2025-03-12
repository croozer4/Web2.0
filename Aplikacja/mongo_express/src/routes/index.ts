import { Router, Request, Response } from "express";
import { homePage } from '../controllers/indexController';

const router = Router();

router.get("/", homePage);

router.get("/kontakt", (req: Request, res: Response) => {
  res.render("kontakt");
});

export default router;
