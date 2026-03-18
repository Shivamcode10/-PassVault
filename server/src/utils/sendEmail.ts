import nodemailer from "nodemailer";

export const sendOTP = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"PassVault" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 Your OTP Code",
    html: `<h2>Your OTP is: ${otp}</h2><p>Valid for 5 minutes</p>`,
  });
};