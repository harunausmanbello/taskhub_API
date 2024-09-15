"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const course_1 = __importDefault(require("../schema/course"));
exports.default = {
    deletecourse: async (id) => {
        return await course_1.default.findByIdAndDelete(id)
            .then((data) => {
            if (!data) {
                return {
                    code: 404,
                    message: "Course not found",
                };
            }
            return {
                code: 200,
                message: "Course Deleted successfully",
            };
        })
            .catch((error) => {
            if (error.name === "CastError" && error.kind === "ObjectId") {
                return {
                    code: 400,
                    message: "Invalid course ID format",
                };
            }
            return {
                code: 500,
                message: error.message,
            };
        });
    },
};
