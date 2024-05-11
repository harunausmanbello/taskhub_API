import _ from "lodash";

import { UpdateUser } from "../../dtos/lecturer";
import User from "../schema/user";
export default {
  updateuser: async (userBody: UpdateUser) => {
    const { _id, firstname, lastname, email } = userBody;
    return await User.findByIdAndUpdate(_id, {
      firstname,
      lastname,
      email,
    })
      .then((data) => {
        if (!data) {
          return {
            code: 404,
            message: "User not found",
          };
        }
        return {
          code: 200,
          message: "User updated successfully",
        };
      })
      .catch((error) => {
        const errorMessage =
          error.code === 11000 && error.keyPattern.email
            ? "The email provided already exists."
            : error.details?.[0]?.message?.status ||
              error.message ||
              "Unknown error occurred.";

        return {
          code: 409,
          message: errorMessage,
        };
      });
  },
};
