import { Router, Request, Response } from "express";
import SignInInterface from "../dtos/signin";
import inputSchema from "../validators/signin";
import signinInputs from "../models/signin/signin";
import verifyToken from "../validators/token";
import AuthRequest from "../dtos/token";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  const inputBody = req.body as SignInInterface;

  inputSchema
    .validateAsync(inputBody)
    .then((validatedData) => signinInputs.signin(validatedData))
    .then((response) => {
      if (response.token) {
        res.setHeader("x-auth-token", response.token);
      }
      res.json(response);
    })
    .catch((error) =>
      res
        .status(404)
        .send(error.details ? error.details[0].message : error.message)
    );
});

router.get("/token", verifyToken, (req: AuthRequest, res: Response) => {
  const payload: { _id: string; email: string } = req.payloadData;
  res.status(200).send(payload);
});

export default router;
