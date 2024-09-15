"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const course_1 = __importDefault(require("../schema/course"));
const enroll_course_1 = __importDefault(require("../schema/enroll_course"));
const lodash_1 = __importDefault(require("lodash"));
exports.default = {
    viewcourses: async (studentId) => {
        const courses = await course_1.default.find();
        const enrollments = await enroll_course_1.default.find({
            studentId,
        });
        const enrolledCourseIds = enrollments.map((enrollment) => enrollment.courseId);
        const selectedCourses = courses.map((course) => {
            const status = enrolledCourseIds.includes(course._id.toString())
                ? "enrolled"
                : "not-enrolled";
            return Object.assign(Object.assign({}, lodash_1.default.pick(course, ["_id", "code", "title", "cu"])), { status: status });
        });
        return selectedCourses;
    },
};
