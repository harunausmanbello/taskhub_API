import _ from "lodash";
import { AddCourse } from "../../dtos/lecturer";
import { addCourse } from "../../validators/lecturer";
import Course from "../schema/course";

export default {
  addcourse: async (addCourseBody: AddCourse) => {
    return addCourse
      .validateAsync(addCourseBody)
      .then(async () => {
        const newCourse: any = new Course(
          _.pick(addCourseBody, ["title", "code", "cu"])
        );
        return newCourse
          .save()
          .then((course: AddCourse) => {
            return {
              code: 201,
              userData: "Course added successfully",
            };
          })
          .catch((error: any) => {
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
      })
      .catch((error: any) => {
        return {
          code: 400,
          message: error.details
            ? error.details[0].message.status
            : error.message,
        };
      });
  },
};
