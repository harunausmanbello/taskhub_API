"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const submits_1 = __importDefault(require("../schema/submits"));
const user_1 = __importDefault(require("../schema/user"));
const assignment_1 = __importDefault(require("../schema/assignment"));
const course_1 = __importDefault(require("../schema/course"));
exports.default = {
    viewassignment: () => {
        return submits_1.default.find()
            .populate("assignmentId") // Populate the assignmentId field in Submits
            .then((assignments) => {
            const selectedCoursesPromises = assignments.map((assignment) => {
                const { studentId, assignmentId, status } = assignment; //from submit assignmen model
                const matricPromise = user_1.default.findById(studentId).then((user) => {
                    return user ? user.matric.toUpperCase() : null; //return matric
                });
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
                return selectedCourses.length !== 0
                    ? { code: 200, message: selectedCourses }
                    : { code: 204, message: "No assignments have been submitted yet" }; // return value is an array of objects
            });
        })
            .catch((error) => {
            return {
                code: 400,
                message: error.details ? error.details[0].message : error.message,
            };
        });
    },
};
