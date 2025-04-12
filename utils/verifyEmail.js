// Looking to send emails in production? Check out our Email API/SMTP product!

import { MailtrapTransport } from "mailtrap";
import nodemailer from "nodemailer";

const sendVerificationEmail = async function (email, token) {
  try {
    const transporter = nodemailer.createTransport({
      port: process.env.EMAIL_PORT,
      host: process.env.EMAIL_HOST,
      secure: process.env.EMAIL_SECURE === true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const verificationURL = `http://localhost:8080/api/v1/user/verify/${token}`;

    let message = {
      from: `"Nodemailer" <${process.env.GMAIL_USER}>`,
      to: `"Nodemailer" <${email}>`,
      text: "Please verify message",
      html: `<a href=${verificationURL}>Verify here</a>`,
    };

    const info = await transporter.sendMail(message);
    console.log("Verification email send: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending verification email: ", error);
    return false;
  }
};

export default sendVerificationEmail;
