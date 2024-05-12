import CourseEnroll from "../schema/enroll_course";
import Course from "../schema/course";
import _ from "lodash";

export default {
  viewassignment: async (studentId: string) => {
    const enrollments = await CourseEnroll.find({ studentId });

    const courseIds = enrollments.map((enrollment) => enrollment.courseId);

    const courses = await Course.find({ _id: { $in: courseIds } });

    return courses.map((course) => _.pick(course, ["code", "title", "cu"]));
  },
};
