import { Router, Request, Response } from "express";
import inputSchema from "../validators/signup";
import SignUpInterface from "../dtos/signup";
import signupInputs from "../models/signup";
import signupMail from "../models/signup_mail";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const inputBody = req.body as SignUpInterface;

  inputSchema
    .validateAsync(inputBody)
    .then(async (validatedData) => signupInputs.signup(validatedData))
    .then(async (response) => {

      if (response && response.code === 201) {
        const mail: any = await signupMail.signupMail(response.userData);
        res.status(200).send(mail);
      } else {
        res.status(400).send(response);
      }
  
    })
    .catch((error) =>
      res
        .status(404)
        .send(error.details ? error.details[0].message : error.message)
    );
});

export default router;
