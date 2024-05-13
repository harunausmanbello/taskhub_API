import Assignment from "../schema/assignment";
import _ from "lodash";

export default {
  viewcourseassignment: async (courseId: string) => {
    const courses = await Assignment.find({ courseId: courseId });
    return courses.length === 0
      ? { code: 400, message: "Invalid Course ID format" }
      : courses.map((course, index) =>
          _.pick(course, ["_id", "name", "description", "from", "to", "status"])
        );
  },
};
