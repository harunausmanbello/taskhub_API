import { Router, Request, Response } from "express";
import inputSchema from "../validators/signup";
import SignUpInterface from "../dtos/signup";
import signupInputs from "../models/signup";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const inputBody = req.body as SignUpInterface;

  inputSchema
    .validateAsync(inputBody)
    .then(async (validatedData) => signupInputs.signup(validatedData))
    .then((response) => res.status(201).send(response))
    .catch((error) =>
      res
        .status(404)
        .send(error.details ? error.details[0].message : error.message)
    );
});

export default router;
