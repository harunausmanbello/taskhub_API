import Submits from "../schema/submits";
import _ from "lodash";

export default {
  submitassignment: async (payload: {
    studentId: string;
    assignmentId: string;
    file: { originalname: string };
  }) => {
    const submitAssignment: any = new Submits({
      studentId: _.get(payload, "studentId"),
      assignmentId: _.get(payload, "assignmentId"),
      file: _.get(payload, "file.originalname"),
    });
    return await submitAssignment
      .save()
      .then(() => {
        return {
          code: 201,
          message: `You have successfully submitted your assignment..`,
        };
      })
      .catch((error: any) => {
        const errorMessage =
          error.code === 11000 && error.keyPattern.assignmentId
            ? `You have already submitted your assignment for this course.`
            : error.details?.[0]?.message?.status ||
              error.message ||
              "Unknown error occurred.";

        return {
          code: error.code === 11000 ? 409 : 500,
          message: errorMessage,
        };
      });
  },
};
