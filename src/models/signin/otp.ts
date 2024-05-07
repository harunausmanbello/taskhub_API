import crypto from "crypto";
import _ from "lodash";
import nodemailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";

import OtpSchema from "../schema/otp";
import OtpInterface, { Mail, MailOptions } from "../../dtos/otp";

import User from "../schema/user";

export default {
  otpmail: async (mailBody: Mail) => {
    const { _id, email }: Mail = mailBody;

    const otp: string = crypto.randomBytes(3).toString("hex");

    const userData: { _id: string; firstname: string } | null =
      await User.findById(_id);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "harunarrasheeed@gmail.com",
        pass: "luwxlxkdcjooreen",
      },
    });

    // Load the email template file
    const templateFile: string = fs.readFileSync(
      "./src/views/signin/email.ejs",
      "utf8"
    );

    // Compile the email template using EJS
    const compiledTemplate = ejs.compile(templateFile);

    // Define the email message options
    const mailOptions: MailOptions = {
      from: "harunarrasheeed@gmail.com",
      to: email,
      subject: "OTP Verification",
      html: compiledTemplate({
        recipientName: userData?.firstname,
        senderName: "Rashid",
        otp: otp,
      }),
    };

    const newOtp: OtpInterface = new OtpSchema({
      userId: _id,
      otp: otp,
    });

    return await transporter
      .sendMail(mailOptions)
      .then((info) => {
        return newOtp
          .save()
          .then(async () => {
            return info.rejected.length === 0
              ? { code: 200, message: "Email sent successfully" }
              : { code: 207, message: "The email was rejected" };
          })
          .catch((error: any) => {
            return {
              code: 404,
              message: error.details ? error.details[0].message : error.message,
            };
          });
      })
      .catch(() => {
        return {
          success: 500,
          message: "An error occurred while sending the emai",
        };
      });
  },
};
