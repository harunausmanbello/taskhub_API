import _ from "lodash";
import bcrypt from "bcrypt";

import validatePassword from "../../validators/password_complexity";
import SignUp, { Mail } from "../../dtos/signup";
import inputSchema from "../../validators/signup";
import UserSignUp from "../schema/user";

export default {
  signup: async (bodyData: SignUp) => {
    return validatePassword(bodyData.password)
      ? inputSchema
          .validateAsync(bodyData)
          .then(async () => {
            const salt: string = await bcrypt.genSalt(10);

            const hashedPassword: string = await bcrypt.hash(
              bodyData.password,
              salt
            );

            const newUser: SignUp = new UserSignUp({
              ..._.pick(bodyData, ["firstname", "lastname", "matric", "email"]),
              password: hashedPassword,
            });

            return newUser
              .save()
              .then((savedRegister: Mail) => {
                return {
                  success: true,
                  message: "User registration successful.",
                  userData: {
                    _id: savedRegister._id,
                    email: savedRegister.email,
                  },
                };
              })
              .catch((error: any) => {
                const errorMessage =
                  error.code === 11000
                    ? error.keyPattern.matric
                      ? "The matric number provided already exists."
                      : error.keyPattern.email
                      ? "The email address provided already exists."
                      : "Duplication error."
                    : error.details?.[0]?.message?.status || error.message;

                return {
                  success: false,
                  message: errorMessage,
                };
              });
          })
          .catch((error: any) => {
            return {
              success: false,
              message: error.details
                ? error.details[0].message.status
                : error.message,
            };
          })
      : { success: false, message: "Password not validated" };
  },
};
