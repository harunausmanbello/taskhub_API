import Course from "../schema/course";
import _ from "lodash";
export default {
  viewcourses: async () => {
    const courses = await Course.find();

    const selectedCourses = courses.map((course) =>
      _.pick(course, ["_id", "title", "code", "cu"])
    );

    if (selectedCourses.length === 0) {
      return { code: 204, message: "No Courses found" };
    }

    return { code: 200, message: selectedCourses };
  },
};
