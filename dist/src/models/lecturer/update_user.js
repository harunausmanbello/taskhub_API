"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../schema/user"));
exports.default = {
    updateuser: async (userBody) => {
        const { id, firstname, lastname, email } = userBody;
        return await user_1.default.findByIdAndUpdate(id, {
            firstname,
            lastname,
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
            if (error.name === "CastError" && error.kind === "ObjectId") {
                return {
                    code: 400,
                    message: "Invalid course ID format",
                };
            }
            const errorMessage = error.code === 11000 && error.keyPattern.email
                ? "The email provided already exists."
                : ((_c = (_b = (_a = error.details) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.status) ||
                    error.message ||
                    "Unknown error occurred.";
            return {
                code: 409,
                message: errorMessage,
            };
        });
    },
};
