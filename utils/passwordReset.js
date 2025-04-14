import nodemailer from "nodemailer";

async function passwordReset(password) {
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

    const message = {
        from: `"Email from: " ${process.env.EMAIL}`,
        to: `"Email to: " ${email}`,
        subject: "Sending Email using Nodemailer and mailtrap",
        text: "Click here",
        html: "<p> Email send to user </p>"
      };
  } catch (error) {}
}
