"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../schema/user"));
exports.default = {
    verifyUser: async (token) => {
        const user = await user_1.default.findOne({
            token: token,
        }, { _id: 1, isVerified: 1 });
        if (!user) {
            return {
                code: 404,
                message: "Your account has not been verified. Please click the button sent to your email again",
            };
        }
        user.isVerified = true;
        await user.save();
        return { code: 200, message: "Your account has been verified." };
    },
};
