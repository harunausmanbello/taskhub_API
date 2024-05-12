import Submits from "../schema/submits";
import User from "../schema/user";

export default {
  markassignment: async (body: { mark: number; matric: string }) => {
    const { matric, mark } = body;
    const user = await User.findOne({ matric }).select("_id");

    if (!user) {
      return { code: 404, message: "Student not found" };
    }

    const submission = await Submits.findOne({ studentId: user._id });

    if (!submission) {
      return { code: 404, message: "Assignment not found" };
    }
    return Submits.updateOne({ marks: mark })
      .then(async () => {
        await Submits.updateOne({ status: "marked" });
        return {
          code: 201,
          message: "You have successfully marked this assignment",
        };
      })
      .catch((error) => {
        return {
          code: 500,
          message: error.details ? error.details[0].message : error.details,
        };
      });
  },
};
