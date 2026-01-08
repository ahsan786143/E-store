import nodemailer from "nodemailer";

// Create and export the transporter once for efficiency
const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  // Note: Adjust 'secure' based on your port/provider (true for 465, false for 587)
  secure: process.env.NODEMAILER_PORT === '465', 
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const sendMail = async (subject, receiver, body) => {
  if (!transporter) {
    console.error("Nodemailer transporter not initialized.");
    return { success: false, message: "Server mail error" };
  }
  
  try {
    const options = {
      from: `"E-store" <${process.env.NODEMAILER_EMAIL}>`,
      to: receiver,
      subject,
      html: body,
    };

    await transporter.sendMail(options);
    return { success: true };

  } catch (error) {
    // IMPORTANT: Log the full error for debugging purposes
    console.error("Error sending email:", error); 
    return { success: false, message: error.message };
  }
};