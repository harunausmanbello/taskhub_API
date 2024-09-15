"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_password_complexity_1 = __importDefault(require("joi-password-complexity"));
const complexityOptions = {
    min: 6,
    max: 244,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
};
const validatePassword = (password) => {
    const result = (0, joi_password_complexity_1.default)(complexityOptions, "Password").validate(password);
    return !result.error ? true : false;
};
exports.default = validatePassword;
