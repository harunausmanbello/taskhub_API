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
        return {
          code: 500,
          message: error.message,
        };
      });
  },
};