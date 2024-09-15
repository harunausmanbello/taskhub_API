import User from "../schema/user";
import _ from "lodash";
export default {
  viewusers: async () => {
    const users = await User.find({ isLecturer: true });

    const selectedUsers = users.map((user) =>
      _.pick(user, ["_id", "firstname", "lastname", "email"])
    );

    if (selectedUsers.length === 0) {
      return { code: 204, message: "No user found" };
    }

    return selectedUsers;
  },
};
