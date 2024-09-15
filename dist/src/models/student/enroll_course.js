"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const enroll_course_1 = __importDefault(require("../schema/enroll_course"));
const course_1 = __importDefault(require("../schema/course"));
exports.default = {
    enrollcourse: async (body) => {
        var _a;
        const enrollCourse = new enroll_course_1.default(lodash_1.default.pick(body, ["studentId", "courseId"]));
        const course = await course_1.default.findById(body.courseId);
        const courseName = (_a = course === null || course === void 0 ? void 0 : course.title) === null || _a === void 0 ? void 0 : _a.toUpperCase();
        return courseName === undefined
            ? { code: 404, message: "No course with this ID was found." }
            : enrollCourse
                .save()
                .then((course) => {
                return {
                    code: 201,
                    message: `You have successfully enrolled in the ${courseName} course.`,
                };
            })
                .catch((error) => {
                var _a, _b, _c;
                const errorMessage = error.code === 11000 && error.keyPattern.courseId
                    ? `You have already enrolled in the ${courseName} course.`
                    : ((_c = (_b = (_a = error.details) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.status) ||
                        error.message ||
                        "Unknown error occurred.";
                return {
                    code: error.code === 11000 ? 409 : 500,
                    message: errorMessage,
                };
            });
    },
};
