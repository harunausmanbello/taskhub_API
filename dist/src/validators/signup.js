"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const password_complexity_1 = __importDefault(require("../validators/password_complexity"));
const inputSchema = joi_1.default.object({
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
    confirm_password: joi_1.default.any().valid(joi_1.default.ref("password")).required().messages({
        "any.only": "Passwords do not match",
        "any.required": "Confirm Password is required",
    }),
});
exports.default = inputSchema;
