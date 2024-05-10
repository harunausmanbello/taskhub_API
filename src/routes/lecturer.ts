import { Router, Request, Response } from "express";
import passport from "passport";
import jwtToken from "../validators/token";
import { lecturerAuthMiddleware } from "../middleware/authorization";
const authenticateJWTPassport: any = passport.authenticate("jwt", {
  session: false,
});

const router = Router();

router.get(
  "/dashboard",
  jwtToken, 
  authenticateJWTPassport,  lecturerAuthMiddleware,
  (req: Request, res: Response) => {
    const user: any | undefined = req.user;

    if (user) {
        const { firstname: userFirstname, lastname: userLastname } = user;
        res.status(200).json({ code: 200, message: `Welcome ${ userFirstname} ${userLastname}` });
    } else {
        res.status(404).json({ code: 404, message: "User not found" });
    }
    
  }
);

export default router;
