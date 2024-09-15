import Submits from "../schema/submits";
import User from "../schema/user";
import path from "path";
import fs from "fs";

export default {
  viewfile: async (matric: string) => {
    const user = await User.findOne({ matric }).select("_id");

    if (!user) {
      return { code: 404, message: "Student not found" };
    }

    const submission = await Submits.findOne({ studentId: user._id }).select(
      "file"
    );

    if (!submission) {
      return { code: 404, message: "Assignment not found" };
    }

    const filePath = path.join(__dirname, "../../", "uploads", submission.file);

    if (fs.existsSync(filePath)) {
      return { code: 200, file: filePath };
    } else {
      return { code: 404, message: "File not found" };
    }
  },
};
