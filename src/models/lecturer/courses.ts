import Course from "../schema/course";
import _ from "lodash";
export default {
  viewcourses: async () => {
    const courses = await Course.find();

    const selectedCourses = courses.map((course) =>
      _.pick(course, ["_id", "title", "code", "cu"])
    );

    return selectedCourses;
  },
};
