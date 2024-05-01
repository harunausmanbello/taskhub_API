import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import config from "config";
import User from "../models/schema/user";
export default function configurePassport(
  passportInstance: passport.PassportStatic
): void {
  // Configure options for JWT strategy
  const jwtOptions: any = {
    jwtFromRequest: ExtractJwt.fromHeader("x-auth-token"),
    secretOrKey: config.get<string>("JWT.TOKEN"), // Replace with your own secret key
  };

  // Define JWT strategy
  passportInstance.use(
    new JwtStrategy(jwtOptions, async (jwtPayload: any, done) => {
      if (!jwtPayload) {
        return done(null, false, { message: "Invalid JWT token" });
      }

      User.findById(jwtPayload._id)
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "User not found" });
          }

          return done(null, user);
        })
        .catch((error) => {
          return done(null, false, { message: "Authentication error" });
        });
    })
  );
}
