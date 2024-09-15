import { ProfileData } from "../../dtos/lecturer";
import User from "../schema/user";

export default {
  updateprofile: async (profileData: ProfileData) => {
    const { _id: userId, firstname, lastname, email } = profileData;

    return await User.findByIdAndUpdate(userId, {
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
          message: "Profile data updated successfully",
        };
      })
      .catch((error) => {
        if (error.name === "CastError" && error.kind === "ObjectId") {
          return {
            code: 400,
            message: "Invalid course ID format",
          };
        }

        return {
          code: 500,
          message: error.message,
        };
      });
  },
};
