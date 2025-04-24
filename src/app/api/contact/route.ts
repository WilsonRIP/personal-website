import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Define the expected structure of the incoming data
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: Request) {
  console.log("Received contact form submission request...");

  try {
    // Parse the JSON data from the request body
    const formData = (await request.json()) as ContactFormData;
    console.log("Form data received:", formData);

    // --- Start Email Sending Logic ---

    // Validate required environment variables
    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS ||
      !process.env.EMAIL_TO
    ) {
      console.error(
        "Missing required environment variables for email configuration."
      );
      return NextResponse.json(
        { message: "Server configuration error." },
        { status: 500 }
      );
    }

    // Create a transporter object using Hostinger SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.hostinger.com", // Use env var or default
      port: parseInt(process.env.SMTP_PORT || "465", 10), // Use env var or default
      secure: parseInt(process.env.SMTP_PORT || "465", 10) === 465, // true for 465, false for other ports like 587
      auth: {
        user: process.env.EMAIL_USER, // Your Hostinger email address
        pass: process.env.EMAIL_PASS, // Your Hostinger email password
      },
    });

    // Define email options
    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        `"${formData.name}" <${process.env.EMAIL_USER}>`, // Sender address (can be customized)
      replyTo: formData.email, // Set reply-to to the user's email
      to: process.env.EMAIL_TO, // List of receivers (your email)
      subject: `New Contact Form Submission: ${formData.subject}`,
      text: `You received a new message from your contact form:

Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}
Message:
${formData.message}
`, // plain text body
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${formData.message}</p>
      `, // html body
    };

    try {
      // Send mail with defined transport object
      await transporter.sendMail(mailOptions);
      console.log("Contact email sent successfully.");
      return NextResponse.json(
        { message: "Form submitted successfully!" },
        { status: 200 }
      );
    } catch (mailError) {
      console.error("Failed to send contact email:", mailError);
      return NextResponse.json(
        { message: "Failed to send message." },
        { status: 500 }
      );
    }
    // --- End Email Sending Logic ---
  } catch (error) {
    console.error("Error processing contact form:", error);
    // Return an error response if parsing fails or another error occurs
    return NextResponse.json(
      { message: "Error processing request." },
      { status: 400 }
    );
  }
}
