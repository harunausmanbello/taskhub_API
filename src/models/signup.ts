import _ from "lodash";
import bcrypt from "bcrypt";

import validatePassword from "../validators/password_complexity";
import SignUpInterface from "../dtos/signup";
import inputSchema from "../validators/signup";
import UserSignUp from "./users";

export default {
  signup: async (data: SignUpInterface) => {
    return validatePassword(data.password)
      ? inputSchema
          .validateAsync(data)
          .then(async () => {
            const salt: string = await bcrypt.genSalt(10);

            const hashedPassword: string = await bcrypt.hash(
              data.password,
              salt
            );

            const newUser: SignUpInterface = new UserSignUp({
              ..._.pick(data, ["firstname", "lastname", "matric", "email"]),
              password: hashedPassword, 
            });

            return newUser
              .save()
              .then((savedRegister: { _id: string; email: string; }) => {
                return {
                  code: 201,
                  message: "User registration successful.",
                  userData: {
                    _id: savedRegister._id,
                    email: savedRegister.email,
                  },
                };
              })
              .catch((error: any) => {
                return error.details ? error.details[0].message.status : error.message;
              });
          })
          .catch((error: any) => {
            return error.details ? error.details[0].message.status : error.message;
          })
      : 'Password not validate';
  },
};
