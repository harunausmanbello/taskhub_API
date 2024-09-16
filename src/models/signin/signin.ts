import _ from "lodash";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";

import SignIn, { SignInUser } from "../../dtos/signin";
import validatePassword from "../../validators/password_complexity";
import signInSchema from "../../validators/signin";
import User from "../schema/user";

export default {
  signin: async (signinBody: SignIn) => {
    const { email, password }: SignIn = _.pick(signinBody, [
      "email",
      "password",
    ]);

    return validatePassword(signinBody.password)
      ? signInSchema
          .validateAsync(signinBody)
          .then(async () => {
            const user: SignInUser | null = await User.findOne({
              email: email,
            });

            if (!user) {
              return {
                code: 404,
                message: "Invalid Email or Password",
              };
            }

            const isPasswordValid: boolean = await bcryptjs.compare(
              password,
              user.password
            );

            if (!isPasswordValid) {
              return {
                code: 404,
                message: "Invalid Email or Password",
              };
            }

            if (!user.isVerified) {
              return {
                code: 403,
                message:
                  "Account Not Verified: Please verify your account to proceed",
              };
            }

            if (user && isPasswordValid && user.isVerified) {
              const tokenFromConfig: string = config.get("TOKEN");
              const token: string = jwt.sign(
                {
                  _id: user._id,
                  email: user.email,
                  isLecturer: user.isLecturer,
                },
                tokenFromConfig
              );
              return {
                code: 200,
                token: token,
                userData: {
                  _id: user._id,
                  email: user.email,
                },
              };
            } else {
              return {
                code: 404,
                message:
                  "Your account has not been verified. Please click the button sent to your email again",
              };
            }
          })
          .catch((error: any) => {
            return {
              code: 400,
              message: error.details ? error.details[0].message : error.message,
            };
          })
      : "Invalid Password check";
  },
};
