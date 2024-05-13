import crypto from "crypto";
import nodemailer from "nodemailer";
import { Mail, MailOptions } from "../../dtos/lecturer";
import ejs from "ejs";
import fs from "fs";

import UserSignUp from "../schema/user";

export default {
  adduser: async (mailBody: Mail) => {
    const { _id, email }: Mail = mailBody;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "harunarrasheeed@gmail.com",
        pass: "luwxlxkdcjooreen",
      },
    });

    const token: string = crypto.randomBytes(16).toString("hex");

    const userData: { _id: string; firstname: string } | null =
      await UserSignUp.findByIdAndUpdate(_id, { token: token });

    // Load the email template file
    const templateFile: string = fs.readFileSync(
      "./src/views/signup/lecturer/email.ejs",
      "utf8"
    );

    // Compile the email template using EJS
    const compiledTemplate = ejs.compile(templateFile);

    // Define the email message options
    const mailOptions: MailOptions = {
      from: "harunarrasheeed@gmail.com",
      to: email,
      subject: "Account Verification",
      html: compiledTemplate({
        recipientName: userData?.firstname,
        senderName: "Rashid",
        url: `lecturer/verify-account/${token}`,
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
        if (error.name === "CastError" && error.kind === "ObjectId") {
          return {
            code: 400,
            message: "Invalid course ID format",
          };
        }
        return {
          code: 500,
          message: "An error occurred while sending the email",
        };
      });
  },
};
