import _ from "lodash";
import UserSignUp from "../schema/user";
import { MailVerification } from "../../dtos/signup";

export default {
  verifyUser: async (data: string) => {
    const user: MailVerification | null = await UserSignUp.findOne({
      token: data,
    });

    if (!user) {
      return "Email has not been Verified, Please click the button again sent to you email";
    }
    user.isVerified = true;
    await user.save();
    return "You Email has been verified.";
  },
};
