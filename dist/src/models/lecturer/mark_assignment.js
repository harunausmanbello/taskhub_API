"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const submits_1 = __importDefault(require("../schema/submits"));
const user_1 = __importDefault(require("../schema/user"));
exports.default = {
    markassignment: async (body) => {
        const { matric, mark } = body;
        const user = await user_1.default.findOne({ matric }).select("_id");
        if (!user) {
            return { code: 404, message: "Student not found" };
        }
        const submission = await submits_1.default.findOne({ studentId: user._id });
        if (!submission) {
            return { code: 404, message: "Assignment not found" };
        }
        return submits_1.default.updateOne({ marks: mark })
            .then(async () => {
            await submits_1.default.updateOne({ status: "marked" });
            return {
                code: 201,
                message: "You have successfully marked this assignment",
            };
        })
            .catch((error) => {
            return {
                code: 500,
                message: error.details ? error.details[0].message : error.details,
            };
        });
    },
};
