import { Router, Request, Response } from "express";
import inputSchema from "../validators/signup";
import SignUpInterface from "../dtos/signup";
import signupInputs from "../models/signup/signup";
import signupMail from "../models/signup/email";
import verify_mail from "../models/signup/email_verification";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const inputBody = req.body as SignUpInterface;

  inputSchema
    .validateAsync(inputBody)
    .then(async (validatedData) => signupInputs.signup(validatedData))
    .then(async (response) => {
      if (response && response.success === true) {
        const mail: any = await signupMail.signupMail(response.userData);
        mail.success ? res.status(201).send(mail) : res.status(503).send(mail);
      } else {
        res.status(400).send(response);
      }
    })
    .catch((error) => {
      res.status(400).send({
        message: error.details ? error.details[0].message : error.message,
      });
    });
});

router.get("/verify/:token", async (req: Request, res: Response) => {
  const token: string = req.params.token;
  return await verify_mail
    .verifyUser(token)
    .then((validatedData) => {
      validatedData.success
        ? res.status(200).send(validatedData.message)
        : res.status(400).send(validatedData.message);
    })
    .catch((error) => {
      res.status(400).send({
        message: error.details ? error.details[0].message : error.message,
      });
    });
});

export default router;
