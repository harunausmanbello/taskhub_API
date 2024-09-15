"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const signup_1 = __importDefault(require("../validators/signup"));
const signup_2 = __importDefault(require("../models/signup/signup"));
const email_1 = __importDefault(require("../models/signup/email"));
const account_verification_1 = __importDefault(require("../models/signup/account_verification"));
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    const inputBody = req.body;
    signup_1.default
        .validateAsync(inputBody)
        .then(async (validatedData) => await signup_2.default.signup(validatedData))
        .then(async (response) => {
        const { code, message, userData } = response;
        if (response && code === 201) {
            const signUpResponse = await email_1.default.signupmail(userData);
            const { code: signUpCode, message: signUpMessage } = signUpResponse;
            res
                .status(signUpCode)
                .json({ code: signUpCode, message: signUpMessage });
        }
        else {
            res.status(code).json({ code: code, message: message });
        }
    })
        .catch((error) => {
        res.status(400).json({
            message: error.details ? error.details[0].message : error.message,
        });
    });
});
router.get("/verify-account/:token", async (req, res) => {
    const token = req.params.token;
    return await account_verification_1.default
        .verifyUser(token)
        .then((validatedData) => {
        const { code, message } = validatedData;
        res.status(code).json({ code: code, message: message });
    })
        .catch((error) => {
        res.status(400).send({
            message: error.details ? error.details[0].message : error.message,
        });
    });
});
exports.default = router;
