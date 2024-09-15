"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const signin_1 = __importDefault(require("../validators/signin"));
const signin_2 = __importDefault(require("../models/signin/signin"));
const token_1 = __importDefault(require("../validators/token"));
const otp_1 = __importDefault(require("../models/signin/otp"));
const verify_otp_1 = __importDefault(require("../models/signin/verify_otp"));
const otp_2 = __importDefault(require("../validators/otp"));
const router = (0, express_1.Router)();
router.post("/", (req, res) => {
    const inputBody = req.body;
    signin_1.default
        .validateAsync(inputBody)
        .then(async (validatedData) => await signin_2.default.signin(validatedData))
        .then(async (response) => {
        const { code, message, token, userData } = response;
        if (code === 200) {
            res.setHeader("x-auth-token", token);
            const otpResponse = await otp_1.default.otpmail(userData);
            const { code: otpCode, message: otpMessage } = otpResponse;
            res.status(otpCode).json({ code: code, message: otpMessage });
        }
        else {
            res.status(code).json({ code: code, message: message });
        }
    })
        .catch((error) => res.status(400).json({
        message: error.details ? error.details[0].message : error.message,
    }));
});
router.post("/verify-otp", token_1.default, async (req, res) => {
    const otp = req.body;
    otp_2.default
        .validateAsync(otp)
        .then(async (validatedData) => {
        const payloads = {
            id: req.payloadData._id,
            otp: validatedData.otp,
        };
        const otpResponse = await verify_otp_1.default.verifyotp(payloads);
        const { code, message } = otpResponse;
        res.status(code).json({ code: code, message: message });
    })
        .catch((error) => {
        res.status(400).json({
            message: error.details ? error.details[0].message : error.message,
        });
    });
});
exports.default = router;
