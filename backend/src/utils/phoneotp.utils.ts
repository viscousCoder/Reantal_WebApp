// // import { createClient } from "redis";

// // const client = createClient({
// //   url: process.env.REDIS_URL || "redis://localhost:6379",
// // });

// client.on("error", (err) => console.error("Redis error:", err));
// client.connect(); // Connect to Redis

// export class OtpUtil {
//   static generateOtp(length: number = 6): string {
//     const digits = "0123456789";
//     let otp = "";
//     for (let i = 0; i < length; i++) {
//       otp += digits[Math.floor(Math.random() * 10)];
//     }
//     return otp;
//   }

//   static async storeOtp(phone: string, otp: string): Promise<void> {
//     await client.setEx(`otp:${phone}`, 300, otp); // 5-minute expiration
//   }

//   static async verifyOtp(phone: string, otp: string): Promise<boolean> {
//     const storedOtp = await client.get(`otp:${phone}`);
//     return storedOtp === otp;
//   }
// }
