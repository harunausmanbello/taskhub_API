import _ from "lodash";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";

import SignInInterface from "../dtos/signin";
import validatePassword from "../validators/password_complexity";
import inputSchema from "../validators/signin";
import UserSignIn from "./users";
export default {
  signin: async (bodyData: SignInInterface) => {
    const { email, password }: SignInInterface = _.pick(bodyData, [
      "email",
      "password",
    ]);

    return validatePassword(bodyData.password)
      ? inputSchema
          .validateAsync(bodyData)
          .then(async () => {
            const user: SignInInterface | null = await UserSignIn.findOne({
              email: email,
            });

            if (!user) {
              return {
                success: false,
                title: "Opps!",
                message: "Invalid Email or Password",
              };
            }

            const isPasswordValid: boolean = await bcrypt.compare(
              password,
              user.password
            );

            if (!isPasswordValid) {
              return {
                success: false,
                title: "Opps!",
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

                userData: {
                  _id: user._id,
                  email: user.email,
                },
              };
            }
          })
          .catch((error: any) => {
            return error.details ? error.details[0].message : error.message;
          })
      : "Invalid Password check";
  },
};
