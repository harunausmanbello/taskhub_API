"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assignment_1 = __importDefault(require("../schema/assignment"));
const lodash_1 = __importDefault(require("lodash"));
exports.default = {
    viewcourseassignment: async (courseId) => {
        const courses = await assignment_1.default.find({ courseId: courseId });
        return courses.length === 0
            ? { code: 400, message: "Invalid Course ID format" }
            : courses.map((course, index) => lodash_1.default.pick(course, ["_id", "name", "description", "from", "to", "status"]));
    },
};
