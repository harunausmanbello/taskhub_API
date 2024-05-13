import _ from "lodash";

import { UpdateCourse } from "../../dtos/lecturer";
import Course from "../schema/course";

export default {
  updatecourse: async (courseBody: UpdateCourse) => {
    const { id, title, code, cu } = courseBody;
    return await Course.findByIdAndUpdate(id, {
      title,
      code,
      cu,
    })
      .then((data) => {
        if (!data) {
          return {
            code: 404,
            message: "Course not found",
          };
        }
        return {
          code: 200,
          message: "Course updated successfully",
        };
      })
      .catch((error) => {
        if (error.name === "CastError" && error.kind === "ObjectId") {
          return {
            code: 400,
            message: "Invalid course ID format",
          };
        }

        const errorMessage =
          error.code === 11000 && error.keyPattern.code
            ? "The course code provided already exists."
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
