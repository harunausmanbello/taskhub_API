"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const password_complexity_1 = __importDefault(require("../validators/password_complexity"));
// Define input schema with password complexity validation
const schema = joi_1.default.object({
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
        "any.invalid": "Invalid password, Password must be contain letters and numbers.",
    })
        .custom((value, helpers) => {
        if (!(0, password_complexity_1.default)(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    }),
});
exports.default = schema;
