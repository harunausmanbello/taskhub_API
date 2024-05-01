import { Router, Request, Response } from "express";
import passport from "passport";
import SignIn from "../dtos/signin";
import signInSchema from "../validators/signin";
import signInModel from "../models/signin/signin";
import jwtToken from "../validators/token";
import AuthRequest from "../dtos/token";

const authenticateJWTPassport: any = passport.authenticate('jwt', { session: false });



const router = Router();

router.post("/",  (req: Request, res: Response) => {
  const inputBody = req.body as SignIn;

  signInSchema
    .validateAsync(inputBody)
    .then((validatedData) => signInModel.signin(validatedData))
    .then((response) => {
      if (response.code === 200) {
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


router.get('/protected', authenticateJWTPassport, (req: Request, res: Response) => {
    res.json({ message: "Authenticated successfully", user: req.user });
});

router.get("/token", jwtToken, (req: AuthRequest, res: Response) => {
  const payload: { _id: string; email: string } = req.payloadData;
  res.status(200).send(payload);
});

export default router;
