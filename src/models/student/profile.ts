import { ProfileData } from "../../dtos/student";
import User from "../schema/user";

export default {
  updateprofile: async (profileData: ProfileData) => {
    const { _id: userId, firstname, lastname, matric, email } = profileData;

    return await User.findByIdAndUpdate(userId, {
      firstname,
      lastname,
      matric,
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
            ? "The email address provided already exists."
            : error.details?.[0]?.message?.status ||
              error.message ||
              "Unknown error occurred.";

        return {
          code: error.code === 11000 ? 409 : 500,
          message: errorMessage,
        };
      });
  },
};
