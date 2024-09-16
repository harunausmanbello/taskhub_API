import _ from "lodash";
import bcryptjs from "bcryptjs";

import validatePassword from "../../validators/password_complexity";
import SignUp, { Mail } from "../../dtos/signup";
import inputSchema from "../../validators/signup";
import UserSignUp from "../schema/user";

export default {
  signup: async (signupBody: SignUp) => {
    return validatePassword(signupBody.password)
      ? inputSchema
          .validateAsync(signupBody)
          .then(async () => {
            const salt: string = await bcryptjs.genSalt(10);

            const hashedPassword: string = await bcryptjs.hash(
              signupBody.password,
              salt
            );

            const newUser: SignUp = new UserSignUp({
              ..._.pick(signupBody, [
                "firstname",
                "lastname",
                "matric",
                "email",
              ]),
              password: hashedPassword,
            });

            return newUser
              .save()
              .then((savedRegister: Mail) => {
                return {
                  code: 201,
                  userData: {
                    _id: savedRegister._id,
                    email: savedRegister.email,
                  },
                };
              })
              .catch((error: any) => {
                const errorMessage =
                  error.code === 11000 && error.keyPattern.email
                    ? "The email address provided already exists."
                    : error.details?.[0]?.message?.status ||
                      error.message ||
                      "Unknown error occurred.";

                return {
                  code: 409,
                  message: errorMessage,
                };
              });
          })
          .catch((error: any) => {
            return {
              code: 400,
              message: error.details
                ? error.details[0].message.status
                : error.message,
            };
          })
      : { code: 400, message: "Password not validated" };
  },
};
