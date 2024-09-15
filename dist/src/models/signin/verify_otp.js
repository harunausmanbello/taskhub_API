"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const otp_1 = __importDefault(require("../schema/otp"));
exports.default = {
    verifyotp: async (otpBody) => {
        const userOtp = await otp_1.default.findOne({
            userId: otpBody.id,
            status: "active",
        });
        return userOtp
            ? otpBody.otp === userOtp.otp
                ? (await otp_1.default.updateOne({ _id: userOtp._id }, { $set: { status: "used" } }),
                    { code: 200, message: "OTP verification successful." })
                : {
                    code: 400,
                    message: "Incorrect OTP. Please enter the OTP sent to your email.",
                }
            : { code: 400, message: "OTP has been used or has expired." };
    },
};
