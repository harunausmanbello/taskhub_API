import _ from "lodash";
import bcrypt from "bcrypt";

import validatePassword from "../../validators/password_complexity";
import { AddUser } from "../../dtos/lecturer";
import { addUser } from "../../validators/lecturer";
import User from "../schema/user";

export default {
  adduser: async (addUserBody: AddUser) => {
    return validatePassword(addUserBody.password)
      ? addUser
          .validateAsync(addUserBody)
          .then(async () => {
            const salt: string = await bcrypt.genSalt(10);

            const hashedPassword: string = await bcrypt.hash(
              addUserBody.password,
              salt
            );

            const newUser: AddUser = new User({
              ..._.pick(addUserBody, [
                "firstname",
                "lastname",
                "email",
                "isLecturer",
              ]),
              password: hashedPassword,
            });

            return newUser
              .save()
              .then((user: { _id: string; email: string }) => {
                return {
                  code: 201,
                  userData: {
                    _id: user._id,
                    email: user.email,
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
