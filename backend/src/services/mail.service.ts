import nodemailer from "nodemailer";
import { mailConfig } from "../config/mail.config";

export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(mailConfig);

    this.verifyEmailConnection().then((isConnected) => {
      console.log(`SMTP connection ${isConnected ? "successful" : "failed"}`);
    });
  }

  async sendOtpEmail(to: string, otp: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Rental App" <${mailConfig.auth.user}>`,
        to,
        subject: "Your OTP Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your OTP Code</h2>
            <p>Your One-Time Password (OTP) is:</p>
            <h3 style="color: #007bff;">${otp}</h3>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <p>Thank you,<br>The Rental App Team</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      // console.log(`OTP email sent to ${to}`);
      return true;
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
      return false;
    }
  }

  async verifyEmailConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error("Email connection error:", error);
      return false;
    }
  }
}

export class PassMailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(mailConfig);

    this.verifyEmailConnection().then((isConnected) => {
      console.log(`SMTP connection ${isConnected ? "successful" : "failed"}`);
    });
  }

  async sendResetPasswordEmail(to: string, link: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Rental App" <${mailConfig.auth.user}>`,
        to,
        subject: "Reset Your Password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password. Click the button below to proceed:</p>
            <a href="${link}" style="display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>This link will expire in 15 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>– Rental App Team</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Error sending reset link email:", error);
      return false;
    }
  }

  async verifyEmailConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error("Email connection error:", error);
      return false;
    }
  }
}
