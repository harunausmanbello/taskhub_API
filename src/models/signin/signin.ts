import _ from "lodash";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";

import SignIn, { SignInUser } from "../../dtos/signin";
import validatePassword from "../../validators/password_complexity";
import signInSchema from "../../validators/signin";
import UserSignIn from "../schema/users";

export default {
  signin: async (bodyData: SignIn) => {
    const { email, password }: SignIn = _.pick(bodyData, ["email", "password"]);

    return validatePassword(bodyData.password)
      ? signInSchema
          .validateAsync(bodyData)
          .then(async () => {
            const user: SignInUser | null = await UserSignIn.findOne({
              email: email,
            });

            if (!user) {
              return {
                code: 401,
                message: "Invalid Email or Password",
              };
            }

            const isPasswordValid: boolean = await bcrypt.compare(
              password,
              user.password
            );

            if (!isPasswordValid) {
              return {
                code: 401,
                message: "Invalid Email or Password",
              };
            }

            if (user && isPasswordValid) {
              const tokenFromConfig: string = config.get("JWT.TOKEN");
              const token: string = jwt.sign(
                { _id: user._id, email: user.email },
                tokenFromConfig,
                { expiresIn: "1h" }
              );
              return {
                code: 200,
                token: token,
              };
            }
          })
          .catch((error: any) => {
            return error.details ? error.details[0].message : error.message;
          })
      : "Invalid Password check";
  },
};
