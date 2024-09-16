import { ChangePassword } from "../../dtos/lecturer";
import bcryptjs from "bcryptjs";
import User from "../schema/user";

export default {
  changepassword: async (passwordBody: ChangePassword) => {
    const { userId, currentPassword, newPassword } = passwordBody;
    const user: ChangePassword | null = await User.findById({
      _id: userId,
    });

    if (!user) {
      return {
        code: 404,
        message:
          "We couldn't find a user. Double-check your entry and try again.",
      };
    }

    const isPasswordValid: boolean = await bcryptjs.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return {
        code: 404,
        message:
          "The current password you entered is incorrect. Please confirm and re-enter",
      };
    }

    const salt: string = await bcryptjs.genSalt(10);

    const hashedPassword: string = await bcryptjs.hash(newPassword, salt);
    return User.findOneAndUpdate({ _id: userId }, { password: hashedPassword })
      .then(() => {
        return {
          code: 201,
          message: "Password updated successfully",
        };
      })
      .catch((error: any) => {
        return {
          code: 500,
          message: "Password update failed",
        };
      });
  },
};
