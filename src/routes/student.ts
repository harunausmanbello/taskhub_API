import { Router, Request, Response } from "express";
import passport from "passport";
import jwtToken from "../validators/token";
import { studentAuthMiddleware } from "../middleware/authorization";
import { changePassword, updateProfile } from "../validators/student";
import Passwords, { ChangePassword, ProfileData } from "../dtos/student";
import change_password from "../models/student/change_password";
import updateProfileData from "../models/student/profile";

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
    const userProfile: any = req.user;

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
  "/profile",
  jwtToken,
  authenticateJWTPassport,
  studentAuthMiddleware,
  (req: Request, res: Response) => {
    const userData = req.user as ProfileData;
    const userBody = req.body as ProfileData;

    updateProfile
      .validateAsync(userBody)
      .then(async (validatedData) => {
        const profileData: ProfileData = {
          _id: userData._id,
          firstname: validatedData.firstname,
          lastname: validatedData.lastname,
          matric: validatedData.matric,
          email: validatedData.email,
        };

        const profileResponse = await updateProfileData.updateprofile(
          profileData
        );

        res.status(profileResponse.code).json(profileResponse);
      })
      .catch((error) => {
        res.status(500).json({
          code: 500,
          message: error.details ? error.details[0].message : error.message,
        });
      });
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

        res.status(passwordResponse.code).json(passwordResponse);
      })
      .catch((error) => {
        res.status(400).json({
          code: 400,
          message: error.details ? error.details[0].message : error.message,
        });
      });
  }
);

router.get("/logout", (req: Request, res: Response) => {
  res.removeHeader("x-auth-token");
  res.status(200).json({ code: 200, message: "Logout successful" });
});

export default router;
