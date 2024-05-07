import { Router, Request, Response } from "express";
// import passport from "passport";
import SignIn from "../dtos/signin";
import signInSchema from "../validators/signin";
import signInModel from "../models/signin/signin";
import jwtToken from "../validators/token";
import AuthRequest from "../dtos/token";

import otpMail from "../models/signin/otp";
import verifyOtp from "../models/signin/verify_otp";
import otpSchema from "../validators/otp";

// const authenticateJWTPassport: any = passport.authenticate("jwt", {
//   session: false,
// });

const router = Router();

router.post("/", (req: Request, res: Response) => {
  const inputBody = req.body as SignIn;

  signInSchema
    .validateAsync(inputBody)
    .then(async (validatedData) => await signInModel.signin(validatedData))
    .then(async (response: any) => {
      if (response.code === 200) {
        res.setHeader("x-auth-token", response.token);
        const otpResponse = await otpMail.otpmail(response.userData);
        res.status(otpResponse.code).json({ message: otpResponse.message });
      } else {
        res.status(response.code).json({ message: response.message });
      }
    })
    .catch((error) =>
      res.status(400).json({
        message: error.details ? error.details[0].message : error.message,
      })
    );
});

router.post(
  "/verify-otp",
  jwtToken,
  async (req: AuthRequest, res: Response) => {
    const otp: string = req.body;

    otpSchema
      .validateAsync(otp)
      .then(async (validatedData) => {
        const payloads = {
          id: req.payloadData._id,
          otp: validatedData.otp,
        };

        const otpResponse = await verifyOtp.verifyotp(payloads);

        res.status(otpResponse.code).json({ message: otpResponse.message });
      })
      .catch((error) => {
        res
          .status(400)
          .json({
            message: error.details ? error.details[0].message : error.message,
          });
      });
  }
);

// router.get(
//   "/protected",
//   authenticateJWTPassport,
//   (req: Request, res: Response) => {
//     res
//       .status(200)
//       .send({ message: "Authenticated successfully", user: req.user });
//   }
// );

// router.get("/token", jwtToken, (req: AuthRequest, res: Response) => {
//   const payload: { _id: string; email: string } = req.payloadData;
//   res.status(200).send(payload);
// });

export default router;
