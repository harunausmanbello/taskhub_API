import _ from "lodash";
import Submits from "../schema/submits";
import Assignment from "../schema/assignment";
import Course from "../schema/course";

export default {
  viewgrade: (studentId: string) => {
    return Submits.find({ studentId })
      .populate("assignmentId") // Populate the assignmentId field in Submits
      .then((assignments) => {
        const selectedCoursesPromises = assignments.map((assignment) => {
          const { assignmentId, marks } = assignment; //from submit assignment model

          const assignmentPromise = Assignment.findById(assignmentId).then(
            (assignment) => {
              return assignment ? assignment.name?.toUpperCase() : null; // return assignment model data
            }
          );

          const coursePromise = Assignment.findById(assignmentId)
            .then((assignment) => {
              return assignment ? assignment.courseId : null; //return courseId from assignment model
            })
            .then((courseId) => {
              return Course.findById(courseId).then((course) => {
                return course ? course.code?.toUpperCase() : null; //return course code from course model
              });
            });
          return Promise.all([assignmentPromise, coursePromise]).then(
            ([name, code]) => {
              return {
                assignmentName: name || "No Assignment found",
                courseCode: code || "No Course found",
                Marks: marks,
              };
            }
          );
        });

        return Promise.all(selectedCoursesPromises).then((selectedCourses) => {
          return selectedCourses; // Ensure that the return value is an array of objects
        });
      })
      .catch((error) => {
        console.error("Error fetching assignments:", error);
        throw error;
      });
  },
};
