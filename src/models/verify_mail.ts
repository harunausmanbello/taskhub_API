import _ from "lodash";
import UserSignUp from "./users";
import { SignUpVerifyMailInterface } from "../dtos/signupMail";

export default {
  verifyUser: async (data: string) => {
    const user: SignUpVerifyMailInterface | null = await UserSignUp.findOne({
      token: data,
    });

    if (!user) {
      // If no user found, handle the error (e.g., invalid token)
      return "Email has not been Verified, Please click the button again sent to you email";
    }
    user.isVerified = true;
    await user.save();
    return "You Email has been verified."
  },
};
