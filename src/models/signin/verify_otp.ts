import Otp from "../schema/otp";

export default {
  verifyotp: async (otpBody: { id: string; otp: string }) => {
    const userOtp: any | null = await Otp.findOne({
      userId: otpBody.id,
      status: "active",
    });

    return userOtp
      ? otpBody.otp === userOtp.otp
        ? (await Otp.updateOne(
            { _id: userOtp._id }, 
            { $set: { status: "used" } } 
          ),
          { code: 200, message: "OTP verification successful." })
        : { code: 400, message: "Incorrect OTP. Please enter the OTP sent to your email." }
      : { code: 400, message: "OTP not found or has expired." };
  },
};
