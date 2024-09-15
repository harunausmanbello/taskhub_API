"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const otp_1 = __importDefault(require("../src/models/schema/otp"));
async function updateExpiredOtps() {
    const thirtySecondsAgo = new Date();
    thirtySecondsAgo.setSeconds(thirtySecondsAgo.getSeconds() - 360);
    await otp_1.default.updateMany({ createdAt: { $lt: thirtySecondsAgo }, status: "active" }, // Filtering all the active OTP records > 30 seconds
    { $set: { status: "expired" } } // Set their status to "expired"
    );
}
exports.default = updateExpiredOtps;
