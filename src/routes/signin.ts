import { Router, Request, Response } from "express";

import SignInInterface from "../dtos/signin";
import inputSchema from "../validators/signin";
import signinInputs from "../models/signin";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  const inputBody = req.body as SignInInterface;

  inputSchema
    .validateAsync(inputBody)
    .then((validatedData) => signinInputs.signin(validatedData))
    .then((response) => res.status(200).send(response))
    .catch((error) =>
      res
        .status(404)
        .send(error.details ? error.details[0].message : error.message)
    );
});

export default router;
