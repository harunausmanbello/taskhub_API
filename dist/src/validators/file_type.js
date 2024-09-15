"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const allowedExtensions = [".txt", ".docx"];
function validateFileExtension(file, helpers) {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
        return helpers.error("any.invalid");
    }
    return file;
}
exports.default = validateFileExtension;
