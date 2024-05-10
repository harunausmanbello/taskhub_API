import { Router, Request, Response } from "express";
import passport from "passport";
import jwtToken from "../validators/token";
import { ProfileData, AddUser } from "../dtos/lecturer";
import { updateProfile, changePassword, addUser } from "../validators/lecturer";
import updateProfileData from "../models/lecturer/profile";
import Passwords from "../dtos/lecturer";
import { ChangePassword } from "../dtos/lecturer";
import change_password from "../models/lecturer/change_password";
import { lecturerAuthMiddleware } from "../middleware/authorization";
import addUserModel from "../models/lecturer/add_user";
import addUserMail from "../models/lecturer/email"
import verify_mail from "../models/lecturer/account_verification";


const authenticateJWTPassport: any = passport.authenticate("jwt", {
  session: false,
});

const router = Router();

router.get(
  "/dashboard",
  jwtToken,
  authenticateJWTPassport,
  lecturerAuthMiddleware,
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
  lecturerAuthMiddleware,
  (req: Request, res: Response) => {
    const userProfile: any = req.user;

    if (userProfile) {
      const { firstname, lastname, email } = userProfile;
      res.status(200).json({
        code: 200,
        userData: { firstname, lastname, email },
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
  lecturerAuthMiddleware,
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
  lecturerAuthMiddleware,
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

router.post(
  "/add-user",
  jwtToken,
  authenticateJWTPassport,
  (req: Request, res: Response) => {
    const inputBody = req.body as AddUser;

    addUser
      .validateAsync(inputBody)
      .then(async (validatedData) => await addUserModel.adduser(validatedData))
      .then(async (response) => {
        const { code, message, userData } = response;
        if (response && code === 201) {
          const addUserResponse: any = await addUserMail.adduser(userData);
          const { code: addUserCode, message: addUserMessage } = addUserResponse;
          res.status(addUserCode).json({ code:code, message: addUserMessage });
        } else {
          res.status(code).json({ code:code, message: message });
        }
      })
      .catch((error) => {
        res.status(400).json({
          message: error.details ? error.details[0].message : error.message,
        });
      });
  }
);


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
