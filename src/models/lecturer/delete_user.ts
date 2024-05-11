import User from "../schema/user";
import _ from "lodash";
export default {
  deleteuser: async (id: string) => {
    return await User.findByIdAndDelete(id)
      .then((data) => {
        if (!data) {
          return {
            code: 404,
            message: "User not found",
          };
        }
        return {
          code: 200,
          message: "User Deleted successfully",
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
