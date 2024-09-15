"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assignment_1 = __importDefault(require("../src/models/schema/assignment"));
async function updateExpiredCoursesStatus() {
    const currentDate = new Date();
    // Find all courses that are still active
    const activeCourses = await assignment_1.default.find({
        status: "active",
        to: { $lt: currentDate },
    });
    // Update the status of courses whose end date has passed
    for (const course of activeCourses) {
        await assignment_1.default.updateOne({ _id: course._id }, { status: "inactive" });
    }
}
exports.default = updateExpiredCoursesStatus;
