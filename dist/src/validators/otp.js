"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
// Define input schema with password complexity validation
const schema = joi_1.default.object({
    otp: joi_1.default.string().min(6).max(6).trim().required().messages({
        "string.base": "OTP must be a string",
        "string.empty": "OTP cannot be empty",
        "string.min": "OTP must be {#limit} characters long",
        "string.max": "OTP must be {#limit} characters long",
        "any.required": "OTP is required",
    }),
});
exports.default = schema;
