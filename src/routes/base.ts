import { Router, Request, Response } from "express";
// import config from "config";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).send(`Welcome to TaskHub API`);
});

export default router;
