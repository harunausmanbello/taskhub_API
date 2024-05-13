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
