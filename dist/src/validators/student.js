"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileSchema = exports.updateProfile = exports.changePassword = void 0;
const joi_1 = __importDefault(require("joi"));
const password_complexity_1 = __importDefault(require("./password_complexity"));
const file_type_1 = __importDefault(require("./file_type"));
// Define input schema with password complexity validation
const changePassword = joi_1.default.object({
    _id: joi_1.default.string().required().messages({
        "string.base": "Student Id must be a string",
        "string.empty": "Student Id cannot be empty",
        "any.required": "Student Id is required",
    }),
    currentPassword: joi_1.default.string()
        .min(6)
        .max(244)
        .trim()
        .required()
        .messages({
        "string.base": "Current Password must be a string",
        "string.empty": "Current Password cannot be empty",
        "string.min": "Current Password must be at least {#limit} characters long",
        "string.max": "Current Password must be at most {#limit} characters long",
        "any.required": "Current Password is required",
        "any.invalid": "Invalid password, Current Password must be contain letters and numbers.",
    })
        .custom((value, helpers) => {
        if (!(0, password_complexity_1.default)(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    }),
    newPassword: joi_1.default.string()
        .min(6)
        .max(244)
        .trim()
        .required()
        .messages({
        "string.base": "New Password must be a string",
        "string.empty": "New Password cannot be empty",
        "string.min": "New Password must be at least {#limit} characters long",
        "string.max": "New Password must be at most {#limit} characters long",
        "any.required": "New Password is required",
        "any.invalid": "Invalid password, New Password must be contain letters and numbers.",
    })
        .custom((value, helpers) => {
        if (!(0, password_complexity_1.default)(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    }),
    confirmNewPassword: joi_1.default.any()
        .valid(joi_1.default.ref("newPassword"))
        .required()
        .messages({
        "any.only": "Confirm New Passwords do not match",
        "any.required": "Confirm New Password is required",
    }),
});
exports.changePassword = changePassword;
const updateProfile = joi_1.default.object({
    _id: joi_1.default.string().required().messages({
        "string.base": "Student Id must be a string",
        "string.empty": "Student Id cannot be empty",
        "any.required": "Student Id is required",
    }),
    firstname: joi_1.default.string().min(3).trim().lowercase().required().messages({
        "string.base": "First name must be a string",
        "string.empty": "First name cannot be empty",
        "string.min": "First name must be at least {#limit} characters long",
        "any.required": "First name is required",
    }),
    lastname: joi_1.default.string().min(3).trim().lowercase().required().messages({
        "string.base": "Last name must be a string",
        "string.empty": "Last name cannot be empty",
        "string.min": "Last name must be at least {#limit} characters long",
        "any.required": "Last name is required",
    }),
    matric: joi_1.default.string().min(11).max(11).trim().lowercase().required().messages({
        "string.base": "Matric number must be a string",
        "string.empty": "Matric number cannot be empty",
        "string.min": "Matric number must be {#limit} characters long",
        "string.max": "Matric number must be {#limit} characters long",
        "any.required": "Matric number is required",
    }),
    email: joi_1.default.string().min(5).email().trim().lowercase().required().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email cannot be empty",
        "string.min": "Email must be at least {#limit} characters long",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
});
exports.updateProfile = updateProfile;
const fileSchema = joi_1.default.object({
    studentId: joi_1.default.string().required().messages({
        "string.base": "Student Id must be a string",
        "string.empty": "Student Id cannot be empty",
        "any.required": "Student Id is required",
    }),
    assignmentId: joi_1.default.string().required().messages({
        "string.base": "Assignment Id must be a string",
        "string.empty": "Assignment Id cannot be empty",
        "any.required": "Assignment Id is required",
    }),
    file: joi_1.default.object({
        originalname: joi_1.default.string().required(),
    })
        .custom(file_type_1.default)
        .messages({
        "object.base": "File must be an object",
        "any.required": "File is required",
        "any.invalid": "Invalid file type. Only .txt and .docx files are allowed",
    }),
});
exports.fileSchema = fileSchema;
