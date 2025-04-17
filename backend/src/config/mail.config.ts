import dotenv from "dotenv";

dotenv.config(); // Ensure env variables are loaded

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error("SMTP_USER or SMTP_PASS not defined in .env file");
  process.exit(1); // Exit if credentials are missing
}

export const mailConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // Use false for port 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};
