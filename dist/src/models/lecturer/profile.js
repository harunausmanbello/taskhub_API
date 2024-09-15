"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../schema/user"));
exports.default = {
    updateprofile: async (profileData) => {
        const { _id: userId, firstname, lastname, email } = profileData;
        return await user_1.default.findByIdAndUpdate(userId, {
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
                message: "Profile data updated successfully",
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
