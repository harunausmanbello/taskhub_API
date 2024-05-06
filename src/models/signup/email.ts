import crypto from "crypto";
import nodemailer from "nodemailer";
import { Mail, MailOptions } from "../../dtos/signup";
import ejs from "ejs";
import fs from "fs";

import UserSignUp from "../schema/user";

export default {
  signupMail: async (data: Mail) => {
    const { _id, email }: Mail = data;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "harunarrasheeed@gmail.com",
        pass: "luwxlxkdcjooreen",
      },
    });

    const token: string = crypto.randomBytes(16).toString("hex");

    const returnData: { _id: string; firstname: string } | null =
      await UserSignUp.findByIdAndUpdate(_id, { token: token });

    // Load the email template file
    const templateFile: string = fs.readFileSync(
      "./src/views/signup_mail.ejs",
      "utf8"
    );

    // Compile the email template using EJS
    const compiledTemplate = ejs.compile(templateFile);

    // Define the email message options
    const mailOptions: MailOptions = {
      from: "harunarrasheeed@gmail.com",
      to: email,
      subject: "Email Verification",
      html: compiledTemplate({
        recipientName: returnData?.firstname,
        senderName: "Rashid",
        url: `http://5000/signup/verify/${token}`,
      }),
    };

    return await transporter
      .sendMail(mailOptions)
      .then((info) => {
        return info.rejected.length === 0
          ? { success: true, message: "Email sent successfully: " + token }
          : { success: false, message: "Email was rejected" };
      })
      .catch((error) => {
        return {
          success: false,
          message: "Error occurred while sending email",
        };
      });
  },
};
