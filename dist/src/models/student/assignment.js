"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enroll_course_1 = __importDefault(require("../schema/enroll_course"));
const course_1 = __importDefault(require("../schema/course"));
const assignment_1 = __importDefault(require("../schema/assignment"));
exports.default = {
    viewassignment: async (studentId) => {
        const enrollments = await enroll_course_1.default.find({ studentId });
        const courseIds = enrollments.map((enrollment) => enrollment.courseId);
        const courses = await course_1.default.find({ _id: { $in: courseIds } });
        const courseAssignments = await Promise.all(courses.map(async (course) => {
            const assignmentsCount = await assignment_1.default.countDocuments({
                courseId: course._id,
            });
            return {
                code: course.code,
                title: course.title,
                cu: course.cu,
                assignmentsCount: assignmentsCount,
            };
        }));
        return courseAssignments;
    },
};
