"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const submits_1 = __importDefault(require("../schema/submits"));
const assignment_1 = __importDefault(require("../schema/assignment"));
const course_1 = __importDefault(require("../schema/course"));
exports.default = {
    viewgrade: (studentId) => {
        return submits_1.default.find({ studentId })
            .populate("assignmentId") // Populate the assignmentId field in Submits
            .then((assignments) => {
            const selectedCoursesPromises = assignments.map((assignment) => {
                const { assignmentId, marks, status } = assignment; //from submit assignment model
                const assignmentPromise = assignment_1.default.findById(assignmentId).then((assignment) => {
                    var _a;
                    return assignment ? (_a = assignment.name) === null || _a === void 0 ? void 0 : _a.toUpperCase() : null; // return assignment model data
                });
                const coursePromise = assignment_1.default.findById(assignmentId)
                    .then((assignment) => {
                    return assignment ? assignment.courseId : null; //return courseId from assignment model
                })
                    .then((courseId) => {
                    return course_1.default.findById(courseId).then((course) => {
                        var _a;
                        return course ? (_a = course.code) === null || _a === void 0 ? void 0 : _a.toUpperCase() : null; //return course code from course model
                    });
                });
                return Promise.all([assignmentPromise, coursePromise]).then(([name, code]) => {
                    return {
                        assignmentName: name || "No Assignment found",
                        courseCode: code || "No Course found",
                        Marks: marks,
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
