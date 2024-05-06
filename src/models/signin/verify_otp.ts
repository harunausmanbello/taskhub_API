import Otp from "../schema/otp";
export default {
  verifyotp: async (payload: { id: string; otp: string }) => {
    const userOtp: any | null = await Otp.findOne({
      userId: payload.id,
      status: "expired",
    });

    if (payload.otp === userOtp.otp) {
      return { code: 200, message: "Your OTP is correct" };
    } else {
      return {
        code: 400,
        message: "Incorrect, Please try the correct otp sent to your email",
      };
    }
  },
};
