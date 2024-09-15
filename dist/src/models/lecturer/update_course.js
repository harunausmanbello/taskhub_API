"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const course_1 = __importDefault(require("../schema/course"));
exports.default = {
    updatecourse: async (courseBody) => {
        const { id, title, code, cu } = courseBody;
        return await course_1.default.findByIdAndUpdate(id, {
            title,
            code,
            cu,
        })
            .then((data) => {
            if (!data) {
                return {
                    code: 404,
                    message: "Course not found",
                };
            }
            return {
                code: 200,
                message: "Course updated successfully",
            };
        })
            .catch((error) => {
            var _a, _b, _c;
            if (error.name === "CastError" && error.kind === "ObjectId") {
                return {
                    code: 400,
                    message: "Invalid course ID format",
                };
            }
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
    },
};
