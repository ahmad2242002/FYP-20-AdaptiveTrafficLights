// pages/api/send-welcome-email.js
import nodemailer from 'nodemailer';
import { NextResponse } from "next/server";

export  async function POST(req) {
  try {
    // Get user email from the request
    console.log("helllo");
    const {email,code}  = await req.json();
    // Set up a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'stlcs.fat@gmail.com',
        pass: 'cqzwazmvoavygrww',
      },
    });

    // Set up the email options
    const mailOptions = {
      from: 'STLCS <stlcs.fat@gmail.com>',
      to: email,
      subject: 'Password Reset - OTP Confirmation',
      text: `Dear User,\nYour one-time passcode (OTP) to reset your password is: ${code}.\nPlease use this code to complete the password reset process.\nIf you did not request this change, please contact support immediately.\n\nBest regards,\n\nSTLCS.FAT`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Welcome email sent successfully" }, { status: 200 });
   
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json({ error: "Welcome email sent successfully" }, { status: 500 });
  }
}
