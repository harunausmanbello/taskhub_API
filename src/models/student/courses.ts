import Course from "../schema/course";
import CourseEnroll, { CourseEnrollDocument } from "../schema/enroll_course";
import _ from "lodash";

export default {
  viewcourses: async (studentId: string) => {
    const courses = await Course.find();

    const enrollments: CourseEnrollDocument[] = await CourseEnroll.find({ studentId });

    const enrolledCourseIds = enrollments.map(enrollment => enrollment.courseId);

    const selectedCourses = courses.map(course => {
      const status = enrolledCourseIds.includes(course._id.toString()) ? "enrolled" : "not enrolled";
      return {
        ..._.pick(course, ["_id", "title", "code", "cu"]),
        status: status
      };
    });

    return selectedCourses;
  },
};
