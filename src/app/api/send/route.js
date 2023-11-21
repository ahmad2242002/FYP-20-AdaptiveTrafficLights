// pages/api/send-welcome-email.js
import nodemailer from 'nodemailer';
import { NextResponse } from "next/server";

export  async function POST(req) {
  try {
    // Get user email from the request
    
    const {email}  = await req.json();
    console.log(email)
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
      subject: 'Welcome to our App!',
      text: 'Thank you for signing up. Welcome to our STLCS!',
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Welcome email sent successfully" }, { status: 200 });
   
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json({ error: "Welcome email sent successfully" }, { status: 500 });
  }
}
