import _ from "lodash";
import Submits from "../schema/submits";
import User from "../schema/user";
import Assignment from "../schema/assignment";
import Course from "../schema/course";

export default {
  viewassignment: () => {
    return Submits.find()
      .populate("assignmentId") // Populate the assignmentId field in Submits
      .then((assignments) => {
        const selectedCoursesPromises = assignments.map((assignment) => {
          const { studentId, assignmentId, status } = assignment; //from submit assignmen model

          const matricPromise = User.findById(studentId).then((user) => {
            return user ? user.matric.toUpperCase() : null; //return matric
          });

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
          return Promise.all([
            matricPromise,
            assignmentPromise,
            coursePromise,
          ]).then(([matric, name, code]) => {
            return {
              studentMatric: matric || "No Student found",
              assignmentName: name || "No Assignment found",
              courseCode: code || "No Course found",
              Status: status,
            };
          });
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
