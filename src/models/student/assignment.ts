import CourseEnroll from "../schema/enroll_course";
import Course from "../schema/course";
import Assignment from "../schema/assignment";
import _ from "lodash";

export default {
  viewassignment: async (studentId: string) => {
    const enrollments = await CourseEnroll.find({ studentId });

    const courseIds = enrollments.map((enrollment) => enrollment.courseId);

    const courses = await Course.find({ _id: { $in: courseIds } });

    const courseAssignments = await Promise.all(
      courses.map(async (course) => {
        const assignmentsCount = await Assignment.countDocuments({
          courseId: course._id,
        });
        return {
          code: course.code,
          title: course.title,
          cu: course.cu,
          assignmentsCount: assignmentsCount,
        };
      })
    );

    return courseAssignments;
  },
};
