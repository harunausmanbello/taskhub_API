import _ from "lodash";
import UserSignUp from "../schema/user";
import { AccountVerification } from "../../dtos/signup";

export default {
  verifyUser: async (token: string) => {
    const user: AccountVerification | null = await UserSignUp.findOne(
      {
        token: token,
      },
      { _id: 1, isVerified: 1 }
    );

    if (!user) {
      return {
        code: 404,
        message:
          "Your account has not been verified. Please click the button sent to your email again",
      };
    }
    user.isVerified = true;
    await user.save();
    return { code: 200, message: "Your account has been verified." };
  },
};
