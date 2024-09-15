"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const course_1 = __importDefault(require("../schema/course"));
const lodash_1 = __importDefault(require("lodash"));
exports.default = {
    viewcourses: async () => {
        const courses = await course_1.default.find();
        const selectedCourses = courses.map((course) => lodash_1.default.pick(course, ["_id", "title", "code", "cu"]));
        if (selectedCourses.length === 0) {
            return { code: 204, message: "No Courses found" };
        }
        return { code: 200, message: selectedCourses };
    },
};
