"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const assignment_1 = __importDefault(require("../schema/assignment"));
const lecturer_1 = require("../../validators/lecturer");
const course_1 = __importDefault(require("../schema/course"));
exports.default = {
    assignAssignment: async (body) => {
        const { courseId, reqBody } = body;
        return lecturer_1.assignmentSchema
            .validateAsync(reqBody)
            .then(async () => {
            var _a;
            const course = await course_1.default.findById(courseId);
            const courseName = (_a = course === null || course === void 0 ? void 0 : course.title) === null || _a === void 0 ? void 0 : _a.toUpperCase();
            const newAssignment = new assignment_1.default(Object.assign(Object.assign({}, lodash_1.default.pick(reqBody, ["name", "description", "from", "to"])), { courseId: courseId }));
            return courseName === undefined
                ? { code: 404, message: "No course with this ID was found." }
                : assignment_1.default.findOne({ courseId: courseId, status: "active" })
                    .then((existingAssignment) => {
                    if (existingAssignment) {
                        return {
                            code: 409,
                            message: `An assignment already exists for the ${courseName} course, and the due or deadline has not been reached.`,
                        };
                    }
                    else {
                        return newAssignment
                            .save()
                            .then(() => {
                            return {
                                code: 201,
                                message: `You have successfully added the assignment to the ${courseName} course.`,
                            };
                        })
                            .catch((error) => {
                            return {
                                code: 500,
                                message: "Internal server error.",
                            };
                        });
                    }
                })
                    .catch((error) => {
                    return {
                        code: 500,
                        message: "Internal server error.",
                    };
                });
        })
            .catch((error) => {
            if (error.name === "CastError" && error.kind === "ObjectId") {
                return {
                    code: 400,
                    message: "Invalid course ID format",
                };
            }
            return {
                code: 400,
                message: error.details ? error.details[0].message : error.message,
            };
        });
    },
};
