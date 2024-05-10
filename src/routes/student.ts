import { Router, Request, Response } from "express";
import passport from "passport";
import jwtToken from "../validators/token";
import { studentAuthMiddleware } from "../middleware/authorization";
import changePassword from "../validators/student_password";
import Passwords, { ChangePassword } from "../dtos/student";
import change_password from "../models/student/change_password";

const authenticateJWTPassport: any = passport.authenticate("jwt", {
  session: false,
});

const router = Router();

router.get(
  "/dashboard",
  jwtToken,
  authenticateJWTPassport,
  studentAuthMiddleware,
  (req: Request, res: Response) => {
    const user: any | undefined = req.user;

    if (user) {
      const { firstname: userFirstname, lastname: userLastname } = user;
      res.status(200).json({
        code: 200,
        message: `Welcome ${userFirstname} ${userLastname}`,
      });
    } else {
      res.status(404).json({ code: 404, message: "User not found" });
    }
  }
);

router.get(
  "/profile",
  jwtToken,
  authenticateJWTPassport,
  studentAuthMiddleware,
  (req: Request, res: Response) => {
    const userProfile: any | undefined = req.user;

    if (userProfile) {
      const { firstname, lastname, matric, email } = userProfile;
      res.status(200).json({
        code: 200,
        userData: { firstname, lastname, matric, email },
      });
    } else {
      res.status(404).json({ code: 404, message: "User not found" });
    }
  }
);

router.post(
  "/password",
  jwtToken,
  authenticateJWTPassport,
  studentAuthMiddleware,
  (req: Request, res: Response) => {
    const userData: any | undefined = req.user;
    const userBody: Passwords = req.body;
    const { _id: userId } = userData;

    changePassword
      .validateAsync(userBody)
      .then(async (validatedData) => {
        const Passwords: ChangePassword = {
          userId: userId,
          currentPassword: validatedData.currentPassword,
          newPassword: validatedData.newPassword,
          confirmNewPassword: validatedData.confirmNewPassword,
        };

        const passwordResponse = await change_password.changepassword(
          Passwords
        );

        res.status(passwordResponse.code).json({ message: passwordResponse });
      })
      .catch((error) => {
        res
          .status(400)
          .json({
            code: 400,
            message: error.details ? error.details[0].message : error.message,
          });
      });
  }
);

router.get("/logout", (req: Request, res: Response) => {
  res.setHeader("x-auth-token", "");
  res.status(200).json({ code: 200, message: "Logout successful" });
});

export default router;
