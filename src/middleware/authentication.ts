import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
// import config from "config";
import User from "../models/schema/user";

export default function configurePassport(
  passportInstance: passport.PassportStatic
): void {
  // Configure options for JWT strategy
  const jwtOptions: any = {
    jwtFromRequest: ExtractJwt.fromHeader("x-auth-token"),
    secretOrKey:  'taskHubToken',
  };

  passportInstance.use(
    new JwtStrategy(jwtOptions, (jwtPayload: any, done) => {
      // Find user without async/await
      User.findById(jwtPayload._id)
        .then((user) => {
          // Check if user is found
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          // If user is found, return user
          return done(null, user);
        })
        .catch((error) => {
          // Handle errors
          return done(error, false, { message: "Authentication error" });
        });
    })
  );
}
