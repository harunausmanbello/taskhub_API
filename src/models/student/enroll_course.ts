import _ from "lodash";
import CourseEnroll from "../schema/enroll_course";
import { EnrollCourseIds } from "../../dtos/student";
import Course from "../schema/course";

export default {
  enrollcourse: async (body: EnrollCourseIds) => {
    const enrollCourse: any = new CourseEnroll(
      _.pick(body, ["studentId", "courseId"])
    );

    const course = await Course.findById(body.courseId);
    const courseName: string | undefined = course?.title?.toUpperCase();

    return courseName === undefined
      ? { code: 404, message: "No course with this ID was found." }
      : enrollCourse
          .save()
          .then((course: EnrollCourseIds) => {
            return {
              code: 201,
              message: `You have successfully enrolled in the ${courseName} course.`,
            };
          })
          .catch((error: any) => {
            const errorMessage =
              error.code === 11000 && error.keyPattern.courseId
                ? `You have already enrolled in the ${courseName} course.`
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
