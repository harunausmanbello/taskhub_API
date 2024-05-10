import { Router, Request, Response } from "express";
import inputSchema from "../validators/signup";
import SignUpInterface from "../dtos/signup";
import signupInputs from "../models/signup/signup";
import signupMail from "../models/signup/email";
import verify_mail from "../models/signup/account_verification";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const inputBody = req.body as SignUpInterface;

  inputSchema
    .validateAsync(inputBody)
    .then(async (validatedData) => await signupInputs.signup(validatedData))
    .then(async (response) => {
      const { code, message, userData } = response;
      if (response && code === 201) {
        const signUpResponse: any = await signupMail.signupmail(userData);
        const { code: signUpCode, message: signUpMessage } = signUpResponse;
        res.status(signUpCode).json({ code:code, message: signUpMessage });
      } else {
        res.status(code).json({ code:code, message: message });
      }
    })
    .catch((error) => {
      res.status(400).json({
        message: error.details ? error.details[0].message : error.message,
      });
    });
});

router.get("/verify-account/:token", async (req: Request, res: Response) => {
  const token: string = req.params.token;
  return await verify_mail
    .verifyUser(token)
    .then((validatedData) => {
      const { code, message } = validatedData;
      res.status(code).json({ code:code, message: message });
    })
    .catch((error: any) => {
      res.status(400).send({
        message: error.details ? error.details[0].message : error.message,
      });
    });
});

export default router;
