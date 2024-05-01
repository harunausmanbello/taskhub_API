import crypto from "crypto";
import nodemailer from "nodemailer";
import SignUpMailInterface, {
  SignUpMailOptionInterface,
} from "../dtos/signupMail";
import ejs from "ejs";
import fs from "fs";

import UserSignUp from "./users";

export default {
  signupMail: async (data: SignUpMailInterface) => {
    const { _id, email }: SignUpMailInterface = data;
    try {
      // Create a nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "Gmail", // Use your email service provider
        auth: {
          user: "harunarrasheeed@gmail.com", // Replace with your email address
          pass: "luwxlxkdcjooreen", // Replace with your email password
        },
      });

      const token: string = crypto.randomBytes(16).toString("hex");

      // Save the token to the user document
      const returnData: { _id: string; firstname: string } | null =
        await UserSignUp.findByIdAndUpdate(_id, { token: token });

      // Load the email template file
      const templateFile = fs.readFileSync(
        "./src/views/signup_mail.ejs",
        "utf8"
      );

      // Compile the email template using EJS
      const compiledTemplate = ejs.compile(templateFile);

      // Define the email message options
      const mailOptions: SignUpMailOptionInterface = {
        from: "harunarrasheeed@gmail.com", // Sender address
        to: email, // List of recipients
        subject: "Email Verification", // Subject line
        html: compiledTemplate({
          recipientName: returnData?.firstname,
          senderName: "Rashid",
          url: `http://5000/signup/verify/${token}`,
        }), // Rendered HTML content with userId in URL
      };

      const info: any = await transporter.sendMail(mailOptions);

      return info; // Returning userId
    } catch (error) {
      return error;
    }
  },
};
