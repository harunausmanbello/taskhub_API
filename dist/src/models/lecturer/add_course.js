"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const lecturer_1 = require("../../validators/lecturer");
const course_1 = __importDefault(require("../schema/course"));
exports.default = {
    addcourse: async (addCourseBody) => {
        return lecturer_1.addCourse
            .validateAsync(addCourseBody)
            .then(async () => {
            const newCourse = new course_1.default(lodash_1.default.pick(addCourseBody, ["title", "code", "cu"]));
            return newCourse
                .save()
                .then((course) => {
                return {
                    code: 201,
                    userData: "Course added successfully",
                };
            })
                .catch((error) => {
                var _a, _b, _c;
                const errorMessage = error.code === 11000 && error.keyPattern.code
                    ? "The course code provided already exists."
                    : ((_c = (_b = (_a = error.details) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.status) ||
                        error.message ||
                        "Unknown error occurred.";
                return {
                    code: 409,
                    message: errorMessage,
                };
            });
        })
            .catch((error) => {
            return {
                code: 400,
                message: error.details
                    ? error.details[0].message.status
                    : error.message,
            };
        });
    },
};
