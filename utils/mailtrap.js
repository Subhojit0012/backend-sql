import nodemailer from "nodemailer";

const BASE_URL = "http://lccalhost:8080";
async function sendEmail(email, token) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const verificationUrl = `${BASE_URL}/api/v1/user/${token}`;

    const message = {
      from: `"Email from: " ${process.env.EMAIL}`,
      to: `"Email to: " ${email}`,
      subject: "Sending Email using Nodemailer and mailtrap",
      text: "Click here",
      html: "<p> Email send to user </p>",
    };

    const info = await transporter.sendMail(message);

    console.log(info);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function passwordResetEmail(email) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const verifyPasswordURL = `${BASE_URL}/auth/v1/user/verify/change-password`;

  const message = {
    from: `"Email from: " ${process.env.EMAIL}`,
    to: `"Email to: " ${email}`,
    subject: "Sending Email using Nodemailer and mailtrap",
    text: "Click here",
    html: "<p> Email send to user </p>",
  };
}

export default sendEmail;
