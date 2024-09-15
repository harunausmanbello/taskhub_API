"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markSchema = exports.assignmentSchema = exports.updateUser = exports.updateCourse = exports.addCourse = exports.addUser = exports.updateProfile = exports.changePassword = void 0;
const joi_1 = __importDefault(require("joi"));
const password_complexity_1 = __importDefault(require("./password_complexity"));
// Define input schema with password complexity validation
const changePassword = joi_1.default.object({
    userId: joi_1.default.string().trim().lowercase().required().messages({
        "string.base": "User Id must be a string",
        "string.empty": "User Id cannot be empty",
        "any.required": "User Id is required",
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
    email: joi_1.default.string().min(5).email().trim().lowercase().required().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email cannot be empty",
        "string.min": "Email must be at least {#limit} characters long",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
});
exports.updateProfile = updateProfile;
const addUser = joi_1.default.object({
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
    email: joi_1.default.string().min(5).email().trim().lowercase().required().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email cannot be empty",
        "string.min": "Email must be at least {#limit} characters long",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string()
        .min(6)
        .max(244)
        .trim()
        .required()
        .messages({
        "string.base": "Password must be a string",
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least {#limit} characters long",
        "string.max": "Password must be at most {#limit} characters long",
        "any.required": "Password is required",
        "any.invalid": "Password not validated",
    })
        .custom((value, helpers) => {
        if (!(0, password_complexity_1.default)(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    }),
    isLecturer: joi_1.default.boolean().required().messages({
        "boolean.base": "Lecturer must be a boolean",
        "boolean.empty": "Lecturer cannot be empty",
        "any.required": "Lecturer is required",
    }),
});
exports.addUser = addUser;
const updateUser = joi_1.default.object({
    id: joi_1.default.string().trim().lowercase().required().messages({
        "string.base": "User Id must be a string",
        "string.empty": "User Id cannot be empty",
        "any.required": "User Id is required",
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
    email: joi_1.default.string().min(5).email().trim().lowercase().required().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email cannot be empty",
        "string.min": "Email must be at least {#limit} characters long",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
});
exports.updateUser = updateUser;
const addCourse = joi_1.default.object({
    title: joi_1.default.string().min(3).trim().lowercase().required().messages({
        "string.base": "Course title must be a string",
        "string.empty": "Course title cannot be empty",
        "string.min": "Course title must be at least {#limit} characters long",
        "any.required": "Course title is required",
    }),
    code: joi_1.default.string().min(3).trim().lowercase().required().messages({
        "string.base": "Course code must be a string",
        "string.empty": "Course code cannot be empty",
        "string.min": "Course code must be at least {#limit} characters long",
        "any.required": "Course code is required",
    }),
    cu: joi_1.default.number().required().messages({
        "number.base": "Credit unit must be a number",
        "number.empty": "Credit unit cannot be empty",
        "any.required": "Credit unit is required",
    }),
});
exports.addCourse = addCourse;
const updateCourse = joi_1.default.object({
    id: joi_1.default.string().trim().required().messages({
        "string.base": "Course Id must be a string",
        "string.empty": "Course Id cannot be empty",
        "any.required": "Course Id is required",
    }),
    title: joi_1.default.string().min(3).trim().lowercase().required().messages({
        "string.base": "Course title must be a string",
        "string.empty": "Course title cannot be empty",
        "string.min": "Course title must be at least {#limit} characters long",
        "any.required": "Course title is required",
    }),
    code: joi_1.default.string().min(3).trim().lowercase().required().messages({
        "string.base": "Course code must be a string",
        "string.empty": "Course code cannot be empty",
        "string.min": "Course code must be at least {#limit} characters long",
        "any.required": "Course code is required",
    }),
    cu: joi_1.default.number().required().messages({
        "number.base": "Credit unit must be a number",
        "number.empty": "Credit unit cannot be empty",
        "any.required": "Credit unit is required",
    }),
});
exports.updateCourse = updateCourse;
const assignmentSchema = joi_1.default.object({
    courseId: joi_1.default.string().trim().lowercase().required().messages({
        "string.base": "Course Id must be a string",
        "string.empty": "Course Id cannot be empty",
        "any.required": "Course Id is required",
    }),
    name: joi_1.default.string().min(3).trim().lowercase().required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least {#limit} characters long",
        "any.required": "Name is required",
    }),
    description: joi_1.default.string().min(3).trim().lowercase().required().messages({
        "string.base": "Description must be a string",
        "string.empty": "Description cannot be empty",
        "string.min": "Description must be at least {#limit} characters long",
        "any.required": "Description is required",
    }),
    from: joi_1.default.date().required().messages({
        "date.base": "Date From must be a Date",
        "date.empty": "Date From cannot be empty",
        "any.required": "Date From is required",
    }),
    to: joi_1.default.date().required().messages({
        "date.base": "Date To must be a Date",
        "date.empty": "Date To cannot be empty",
        "any.required": "Date To is required",
    }),
});
exports.assignmentSchema = assignmentSchema;
const markSchema = joi_1.default.object({
    mark: joi_1.default.number().required().messages({
        "number.base": "Mark must be a number",
        "number.empty": "Mark cannot be empty",
        "any.required": "Mark is required",
    }),
    matric: joi_1.default.string().min(11).max(11).trim().required().messages({
        "string.base": "Matric number must be a string",
        "string.empty": "Matric number cannot be empty",
        "string.min": "Matric number must be {#limit} characters long",
        "string.max": "Matric number must be {#limit} characters long",
        "any.required": "Matric number is required",
    }),
});
exports.markSchema = markSchema;
