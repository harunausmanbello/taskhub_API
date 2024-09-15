"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const submits_1 = __importDefault(require("../schema/submits"));
const user_1 = __importDefault(require("../schema/user"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.default = {
    viewfile: async (matric) => {
        const user = await user_1.default.findOne({ matric }).select("_id");
        if (!user) {
            return { code: 404, message: "Student not found" };
        }
        const submission = await submits_1.default.findOne({ studentId: user._id }).select("file");
        if (!submission) {
            return { code: 404, message: "Assignment not found" };
        }
        const filePath = path_1.default.join(__dirname, "../../", "uploads", submission.file);
        if (fs_1.default.existsSync(filePath)) {
            return { code: 200, file: filePath };
        }
        else {
            return { code: 404, message: "File not found" };
        }
    },
};
