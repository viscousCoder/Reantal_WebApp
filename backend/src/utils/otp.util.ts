export class OtpUtil {
  static generateOtp(length: number = 6): string {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  static async storeOtp(email: string, otp: string): Promise<void> {
    // Implement your storage logic here (e.g., Redis, database)
    // Example with Redis:
    // await redis.setEx(`otp:${email}`, 300, otp); // Expires in 5 minutes
    // console.log(`Storing OTP ${otp} for ${email}`);
  }

  static async verifyOtp(email: string, otp: string): Promise<boolean> {
    // Implement your verification logic here
    // Example with Redis:
    // const storedOtp = await redis.get(`otp:${email}`);
    // return storedOtp === otp;
    return true; // Replace with actual implementation
  }
}
