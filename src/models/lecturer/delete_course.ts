import Course from "../schema/course";
import _ from "lodash";
export default {
  deletecourse: async (id: string) => {
    return await Course.findByIdAndDelete(id)
      .then((data) => {
        if (!data) {
          return {
            code: 404,
            message: "Course not found",
          };
        }
        return {
          code: 200,
          message: "Course Deleted successfully",
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
