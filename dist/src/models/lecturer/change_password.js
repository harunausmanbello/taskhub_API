"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../schema/user"));
exports.default = {
    changepassword: async (passwordBody) => {
        const { userId, currentPassword, newPassword } = passwordBody;
        const user = await user_1.default.findById({
            _id: userId,
        });
        if (!user) {
            return {
                code: 404,
                message: "We couldn't find a user. Double-check your entry and try again.",
            };
        }
        const isPasswordValid = await bcrypt_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return {
                code: 404,
                message: "The current password you entered is incorrect. Please confirm and re-enter",
            };
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(newPassword, salt);
        return user_1.default.findOneAndUpdate({ _id: userId }, { password: hashedPassword })
            .then(() => {
            return {
                code: 201,
                message: "Password updated successfully",
            };
        })
            .catch((error) => {
            return {
                code: 500,
                message: "Password update failed",
            };
        });
    },
};
