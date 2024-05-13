import { Router, Request, Response } from "express";
import passport from "passport";
import jwtToken from "../validators/token";
import { studentAuthMiddleware } from "../middleware/authorization";
import * as JoiSchema from "../validators/student";
import * as interfaces from "../dtos/student";
import change_password from "../models/student/change_password";
import updateProfileData from "../models/student/profile";
import enrollCourse from "../models/student/enroll_course";
import viewCourses from "../models/student/courses";
import viewAssignment from "../models/student/assignment";
import viewCourseAssignment from "../models/student/course_assignment";
import submitAssignment from "../models/student/submit_assignment";
import uploadfile from "../../config/multer";
import viewGrade from "../models/student/view_grade";
import Joi from "joi";

const authenticateJWTPassport: any = passport.authenticate("jwt", {
  session: false,
});

const router = Router();

router.get(
  "/dashboard",
  jwtToken,
  authenticateJWTPassport,
  studentAuthMiddleware,
  (req: Request, res: Response) => {
    const user: any | undefined = req.user;

    if (user) {
      const { firstname: userFirstname, lastname: userLastname } = user;
      res.status(200).json({
        code: 200,
        message: `Welcome ${userFirstname} ${userLastname}`,
      });
    } else {
      res.status(404).json({ code: 404, message: "User not found" });
    }
  }
);

router.get(
  "/profile",
  jwtToken,
  authenticateJWTPassport,
  studentAuthMiddleware,
  (req: Request, res: Response) => {
    const userProfile: any = req.user;

    if (userProfile) {
      const { firstname, lastname, matric, email } = userProfile;
      res.status(200).json({
        code: 200,
        userData: { firstname, lastname, matric, email },
      });
    } else {
      res.status(404).json({ code: 404, message: "User not found" });
    }
  }
);

router.post(
  "/profile",
  jwtToken,
  authenticateJWTPassport,
  studentAuthMiddleware,
  (req: Request, res: Response) => {
    const userData = req.user as interfaces.ProfileData;
    const userBody = req.body as interfaces.ProfileData;

    const payload: interfaces.ProfileData = {
      _id: userData._id.toString(),
      firstname: userBody.firstname,
      lastname: userBody.lastname,
      matric: userBody.matric,
      email: userBody.email,
    };

    JoiSchema.updateProfile
      .validateAsync(payload)
      .then(async (validatedData) => {
        const profileData: interfaces.ProfileData = {
          _id: userData._id,
          firstname: validatedData.firstname,
          lastname: validatedData.lastname,
          matric: validatedData.matric,
          email: validatedData.email,
        };

        const profileResponse = await updateProfileData.updateprofile(
          profileData
        );

        res.status(profileResponse.code).json(profileResponse);
      })
      .catch((error) => {
        res.status(400).json({
          code: 400,
          message: error.details ? error.details[0].message : error.message,
        });
      });
  }
);

router.post(
  "/change-password",
  jwtToken,
  authenticateJWTPassport,
  studentAuthMiddleware,
  (req: Request, res: Response) => {
    const userData: any | undefined = req.user;
    const userBody: interfaces.Passwords = req.body;

    const payload = {
      _id: userData._id.toString(),
      currentPassword: userBody.currentPassword,
      newPassword: userBody.newPassword,
      confirmNewPassword: userBody.confirmNewPassword,
    };

    JoiSchema.changePassword
      .validateAsync(payload)
      .then(async (validatedData) => {
        const Passwords: interfaces.ChangePassword = {
          userId: validatedData._id,
          currentPassword: validatedData.currentPassword,
          newPassword: validatedData.newPassword,
          confirmNewPassword: validatedData.confirmNewPassword,
        };

        const passwordResponse = await change_password.changepassword(
          Passwords
        );
        const { code } = passwordResponse;
        res.status(code).json(passwordResponse);
      })
      .catch((error) => {
        res.status(400).json({
          code: 400,
          message: error.details ? error.details[0].message : error.message,
        });
      });
  }
);

router.get(
  "/courses",
  jwtToken,
  authenticateJWTPassport,
  studentAuthMiddleware,
  async (req: Request, res: Response) => {
    const userInfo: any = req.user;
    const _id = userInfo._id.toString();

    const schema = Joi.object({
      _id: Joi.string().trim().lowercase().required().messages({
        "string.base": "Student Id must be a string",
        "string.empty": "Student Id cannot be empty",
        "any.required": "Student Id is required",
      }),
    });

    schema
      .validateAsync({ _id })
      .then(async (id) => {
        const coursesResponse = await viewCourses.viewcourses(id._id);
        res.status(200).json(coursesResponse);
      })
      .catch((error) => {
        res.status(400).json({
          code: 400,
          message: error.details ? error.details[0].message : error.message,
        });
      });
  }
);

router.get(
  "/enroll-course",
  jwtToken,
  authenticateJWTPassport,
  studentAuthMiddleware,
  async (req: Request, res: Response) => {
    const userInfo: any = req.user;
    const courseId: any = req.query.courseId;

    if (userInfo) {
      const { _id: studentId } = userInfo;

      const schema = Joi.object({
        studentId: Joi.string().trim().lowercase().required().messages({
          "string.base": "Student Id must be a string",
          "string.empty": "Student Id cannot be empty",
          "any.required": "Student Id is required",
        }),
        courseId: Joi.string().trim().lowercase().required().messages({
          "string.base": "Course Id must be a string",
          "string.empty": "Course Id cannot be empty",
          "any.required": "Course Id is required",
        }),
      });

      const payload = {
        studentId: studentId.toString(),
        courseId: courseId,
      };

      schema
        .validateAsync(payload)
        .then(async (id) => {
          const response = await enrollCourse.enrollcourse(payload);
          const { code } = response;
          res.status(code).json(response);
        })
        .catch((error) => {
          res.status(400).json({
            code: 400,
            message:
              error.name === "CastError" && error.kind === "ObjectId"
                ? "Invalid course ID format"
                : error.details
                ? error.details[0].message
                : error.message,
          });
        });
    } else {
      res.status(404).json({ code: 404, message: "User not found" });
    }
  }
);

router.get(
  "/assignments",
  jwtToken,
  authenticateJWTPassport,
  studentAuthMiddleware,
  async (req: Request, res: Response) => {
    const userInfo: any = req.user;
    const _id = userInfo._id.toString();

    const schema = Joi.object({
      _id: Joi.string().trim().lowercase().required().messages({
        "string.base": "Student Id must be a string",
        "string.empty": "Student Id cannot be empty",
        "any.required": "Student Id is required",
      }),
    });

    schema
      .validateAsync({ _id })
      .then(async (id) => {
        const response = await viewAssignment.viewassignment(id);
        res.status(200).json(response);
      })
      .catch((error) => {
        res.status(400).json({
          code: 400,
          message:
            error.name === "CastError" && error.kind === "ObjectId"
              ? "Invalid User ID format"
              : error.details
              ? error.details[0].message
              : error.message,
        });
      });
  }
);

router.get(
  "/assignment",
  jwtToken,
  authenticateJWTPassport,
  studentAuthMiddleware,
  async (req: Request, res: Response) => {
    const queryParams: any = req.query;
    const _id: string = queryParams.courseId.toString();

    const schema = Joi.object({
      _id: Joi.string().trim().lowercase().required().messages({
        "string.base": "Course Id must be a string",
        "string.empty": "Course Id cannot be empty",
        "any.required": "Course Id is required",
      }),
    });

    schema
      .validateAsync({ _id })
      .then(async (id) => {
        const response = await viewCourseAssignment.viewcourseassignment(id);
        res.status(200).json(response);
      })
      .catch((error) => {
        res.status(400).json({
          code: 400,
          message:
            error.name === "CastError" && error.kind === "ObjectId"
              ? "Invalid User ID format"
              : error.details
              ? error.details[0].message
              : error.message,
        });
      });
  }
);

router.get(
  "/assignment/course",
  jwtToken,
  authenticateJWTPassport,
  studentAuthMiddleware,
  uploadfile,
  async (req: Request, res: Response) => {
    const queryParams: any = req.query.assignmentId;
    const reqUser: any = req.user;

    const payload = {
      studentId: reqUser._id.toString(),
      assignmentId: queryParams,
      file: { originalname: req.file?.filename },
    };
    JoiSchema.fileSchema
      .validateAsync(payload)
      .then(async (data) => {
        const payloads = {
          studentId: data.studentId,
          assignmentId: data.assignmentId,
          file: data.file,
        };
        const response = await submitAssignment.submitassignment(payloads);
        res.status(response.code).json(response);
      })
      .catch((error) => {
        res.status(400).json({
          code: 400,
          message: error.details ? error.details[0].message : error.message,
        });
      });
  }
);

router.get(
  "/assignment/marks",
  jwtToken,
  authenticateJWTPassport,
  studentAuthMiddleware,
  async (req: Request, res: Response) => {
    const reqUser: any = req.user;
    const _id: string = reqUser._id.toString();

    const schema = Joi.object({
      _id: Joi.string().trim().lowercase().required().messages({
        "string.base": "Student Id must be a string",
        "string.empty": "Student Id cannot be empty",
        "any.required": "Student Id is required",
      }),
    });

    schema
      .validateAsync({ _id })
      .then(async (id) => {
        const response = await viewGrade.viewgrade(id);
        res.status(200).json(response);
      })
      .catch((error) => {
        res.status(400).json({
          code: 400,
          message:
            error.name === "CastError" && error.kind === "ObjectId"
              ? "Invalid User ID format"
              : error.details
              ? error.details[0].message
              : error.message,
        });
      });
  }
);

router.get(
  "/logout",
  jwtToken,
  authenticateJWTPassport,
  studentAuthMiddleware,
  (req: Request, res: Response) => {
    res.removeHeader("x-auth-token");
    res.status(200).json({ code: 200, message: "Logout successful" });
  }
);

export default router;
