"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../schema/user"));
exports.default = {
    deleteuser: async (id) => {
        return await user_1.default.findByIdAndDelete(id)
            .then((data) => {
            if (!data) {
                return {
                    code: 404,
                    message: "User not found",
                };
            }
            return {
                code: 200,
                message: "User Deleted successfully",
            };
        })
            .catch((error) => {
            if (error.name === "CastError" && error.kind === "ObjectId") {
                return {
                    code: 400,
                    message: "Invalid course ID format",
                };
            }
            return {
                code: 500,
                message: error.message,
            };
        });
    },
};
