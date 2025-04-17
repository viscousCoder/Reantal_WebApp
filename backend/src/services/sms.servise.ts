import twilio from "twilio";
import { twilioConfig } from "../config/twilio.config";

export class SmsService {
  private client: twilio.Twilio;

  constructor() {
    this.client = twilio(twilioConfig.accountSid, twilioConfig.authToken);
    this.verifyConnection().then((isConnected) => {
      console.log(`Twilio connection ${isConnected ? "successful" : "failed"}`);
    });
  }

  async sendOtpSms(to: string, otp: string): Promise<boolean> {
    try {
      const message = await this.client.messages.create({
        body: `Your Rental App OTP is ${otp}. It expires in 5 minutes.`,
        from: twilioConfig.phoneNumber,
        to: `+${to}`, // Expects phone with country code (e.g., +919876543210)
      });
      console.log(`SMS sent to ${to}: ${message.sid}`);
      return true;
    } catch (error) {
      console.error(`Error sending SMS to ${to}:`, error);
      return false;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.client.api.accounts.list();
      return true;
    } catch (error) {
      console.error("Twilio connection error:", error);
      return false;
    }
  }
}

// import twilio from "twilio";

// export class SmsService {
//   private client: twilio.Twilio;

//   constructor() {
//     const accountSid = process.env.TWILIO_ACCOUNT_SID;
//     const authToken = process.env.TWILIO_AUTH_TOKEN;
//     if (!accountSid || !authToken) {
//       throw new Error("Twilio credentials not configured");
//     }
//     this.client = twilio(accountSid, authToken);
//   }

//   async sendOtpSms(to: string, otp: string): Promise<boolean> {
//     try {
//       const message = await this.client.messages.create({
//         body: `Your OTP code is ${otp}. It expires in 5 minutes.`,
//         from: process.env.TWILIO_PHONE_NUMBER,
//         to: `+${to}`, // Ensure phone number includes country code (e.g., +919876543210)
//       });
//       console.log(`SMS sent to ${to}: ${message.sid}`);
//       return true;
//     } catch (error) {
//       console.error(`Error sending SMS to ${to}:`, error);
//       return false;
//     }
//   }

//   async verifyConnection(): Promise<boolean> {
//     try {
//       await this.client.api.accounts.list();
//       console.log("Twilio connection successful");
//       return true;
//     } catch (error) {
//       console.error("Twilio connection error:", error);
//       return false;
//     }
//   }
// }
