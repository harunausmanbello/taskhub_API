"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../schema/user"));
exports.default = {
    updateprofile: async (profileData) => {
        const { _id: userId, firstname, lastname, matric, email } = profileData;
        return await user_1.default.findByIdAndUpdate(userId, {
            firstname,
            lastname,
            matric,
            email,
        })
            .then((data) => {
            if (!data) {
                return {
                    code: 404,
                    message: "User not found",
                };
            }
            return {
                code: 200,
                message: "User updated successfully",
            };
        })
            .catch((error) => {
            var _a, _b, _c;
            const errorMessage = error.code === 11000 && error.keyPattern.email
                ? "The email address provided already exists."
                : ((_c = (_b = (_a = error.details) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.status) ||
                    error.message ||
                    "Unknown error occurred.";
            return {
                code: error.code === 11000 ? 409 : 500,
                message: errorMessage,
            };
        });
    },
};
