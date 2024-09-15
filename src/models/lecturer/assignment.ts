import _ from "lodash";
import { AssignAssignment } from "../../dtos/lecturer";
import Assignment from "../schema/assignment";
import { assignmentSchema } from "../../validators/lecturer";
import Course from "../schema/course";
export default {
  assignAssignment: async (body: {
    courseId: string;
    reqBody: AssignAssignment;
  }) => {
    const { courseId, reqBody } = body;

    return assignmentSchema
      .validateAsync(reqBody)
      .then(async () => {
        const course = await Course.findById(courseId);
        const courseName: string | undefined = course?.title?.toUpperCase();

        const newAssignment = new Assignment({
          ..._.pick(reqBody, ["name", "description", "from", "to"]),
          courseId: courseId,
        });

        return courseName === undefined
          ? { code: 404, message: "No course with this ID was found." }
          : Assignment.findOne({ courseId: courseId, status: "active" })
              .then((existingAssignment) => {
                if (existingAssignment) {
                  return {
                    code: 409,
                    message: `An assignment already exists for the ${courseName} course, and the due or deadline has not been reached.`,
                  };
                } else {
                  return newAssignment
                    .save()
                    .then(() => {
                      return {
                        code: 201,
                        message: `You have successfully added the assignment to the ${courseName} course.`,
                      };
                    })
                    .catch((error) => {
                      return {
                        code: 500,
                        message: "Internal server error.",
                      };
                    });
                }
              })
              .catch((error) => {
                return {
                  code: 500,
                  message: "Internal server error.",
                };
              });
      })
      .catch((error: any) => {
        if (error.name === "CastError" && error.kind === "ObjectId") {
          return {
            code: 400,
            message: "Invalid course ID format",
          };
        }

        return {
          code: 400,
          message: error.details ? error.details[0].message : error.message,
        };
      });
  },
};
