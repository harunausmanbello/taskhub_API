"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const fs_1 = __importDefault(require("fs"));
const user_1 = __importDefault(require("../schema/user"));
exports.default = {
    signupmail: async (mailBody) => {
        const { _id, email } = mailBody;
        const transporter = nodemailer_1.default.createTransport({
            service: "Gmail",
            auth: {
                user: "harunarrasheeed@gmail.com",
                pass: "luwxlxkdcjooreen",
            },
        });
        const token = crypto_1.default.randomBytes(16).toString("hex");
        const userData = await user_1.default.findByIdAndUpdate(_id, { token: token });
        // Load the email template file
        const templateFile = fs_1.default.readFileSync("./src/views/signup/student/email.ejs", "utf8");
        // Compile the email template using EJS
        const compiledTemplate = ejs_1.default.compile(templateFile);
        // Define the email message options
        const mailOptions = {
            from: "harunarrasheeed@gmail.com",
            to: email,
            subject: "Account Verification",
            html: compiledTemplate({
                recipientName: userData === null || userData === void 0 ? void 0 : userData.firstname,
                senderName: "Rashid",
                url: `signup/verify-account/${token}`,
            }),
        };
        return await transporter
            .sendMail(mailOptions)
            .then((info) => {
            return info.rejected.length === 0
                ? { code: 200, message: "Email sent successfully" }
                : { code: 207, message: "The email was rejected" };
        })
            .catch((error) => {
            return {
                code: 500,
                message: "An error occurred while sending the email",
            };
        });
    },
};
