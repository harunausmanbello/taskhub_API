import { Router, Request, Response } from "express";
import passport from "passport";
import Joi from "joi";
import jwtToken from "../validators/token";
import * as interfaces from "../dtos/lecturer";
import * as JoiSchema from "../validators/lecturer";
import updateProfileData from "../models/lecturer/profile";
import change_password from "../models/lecturer/change_password";
import { lecturerAuthMiddleware } from "../middleware/authorization";
import addUserModel from "../models/lecturer/add_user";
import addCourseModel from "../models/lecturer/add_course";
import addUserMail from "../models/lecturer/email";
import verify_mail from "../models/lecturer/account_verification";
import viewCourses from "../models/lecturer/courses";
import updateCourseModel from "../models/lecturer/update_course";
import deleteCourse from "../models/lecturer/delete_course";
import deleteUser from "../models/lecturer/delete_user";
import viewUsers from "../models/lecturer/users";
import updateUserModel from "../models/lecturer/update_user";
import assignAssignment from "../models/lecturer/assignment";
import viewAssignment from "../models/lecturer/view_assignment";
import viewFile from "../models/lecturer/view_file";
import markAssignment from "../models/lecturer/mark_assignment";

const authenticateJWTPassport: any = passport.authenticate("jwt", {
  session: false,
});

const router = Router();

router.get(
  "/dashboard",
  jwtToken,
  authenticateJWTPassport,
  lecturerAuthMiddleware,
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
  lecturerAuthMiddleware,
  (req: Request, res: Response) => {
    const userProfile: any = req.user;

    if (userProfile) {
      const { firstname, lastname, email } = userProfile;
      res.status(200).json({
        code: 200,
        userData: { firstname, lastname, email },
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
  lecturerAuthMiddleware,
  (req: Request, res: Response) => {
    const userData = req.user as interfaces.ProfileData;
    const userBody = req.body as interfaces.ProfileData;

    JoiSchema.updateProfile
      .validateAsync(userBody)
      .then(async (validatedData) => {
        const profileData: interfaces.ProfileData = {
          _id: userData._id,
          firstname: validatedData.firstname,
          lastname: validatedData.lastname,
          email: validatedData.email,
        };

        const profileResponse = await updateProfileData.updateprofile(
          profileData
        );

        const { code } = profileResponse;

        res.status(code).json(profileResponse);
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
  lecturerAuthMiddleware,
  (req: Request, res: Response) => {
    const userData: any | undefined = req.user;
    const userBody: interfaces.Passwords = req.body;

    const payload = {
      userId: userData._id.toString(),
      currentPassword: userBody.currentPassword,
      newPassword: userBody.newPassword,
      confirmNewPassword: userBody.confirmNewPassword,
    };

    JoiSchema.changePassword
      .validateAsync(payload)
      .then(async (validatedData) => {
        const Passwords: interfaces.ChangePassword = {
          userId: validatedData.userId,
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
  "/users",
  jwtToken,
  authenticateJWTPassport,
  lecturerAuthMiddleware,
  async (req: Request, res: Response) => {
    const response = await viewUsers.viewusers();
    res.status(200).json(response);
  }
);

router.post(
  "/add-user",
  jwtToken,
  authenticateJWTPassport,
  lecturerAuthMiddleware,
  (req: Request, res: Response) => {
    const inputBody = req.body as interfaces.AddUser;

    JoiSchema.addUser
      .validateAsync(inputBody)
      .then(async (validatedData) => await addUserModel.adduser(validatedData))
      .then(async (response) => {
        const { code, message, userData } = response;
        if (response && code === 201) {
          const addUserResponse: any = await addUserMail.adduser(userData);
          const { code: addUserCode, message: addUserMessage } =
            addUserResponse;
          res
            .status(addUserCode)
            .json({ code: addUserCode, message: addUserMessage });
        } else {
          res.status(code).json({ code: code, message: message });
        }
      })
      .catch((error) => {
        res.status(400).json({
          code: 400,
          message: error.details ? error.details[0].message : error.message,
        });
      });
  }
);

router.put(
  "/user",
  jwtToken,
  authenticateJWTPassport,
  lecturerAuthMiddleware,
  async (req: Request, res: Response) => {
    const id = req.query;
    const userBody = req.body as interfaces.UpdateUser;

    const payload = {
      id: id.id,
      firstname: userBody.firstname,
      lastname: userBody.lastname,
      email: userBody.email,
    };

    JoiSchema.updateUser
      .validateAsync(payload)
      .then(async (userBody) => {
        const payload = {
          id: userBody.id.toString(),
          firstname: userBody.firstname,
          lastname: userBody.lastname,
          email: userBody.email,
        };
        const response = await updateUserModel.updateuser(payload);
        const { code } = response;
        res.status(code).json(response);
      })
      .catch((error) => {
        res.status(400).json({
          code: 400,
          message: error.details ? error.details[0].message : error.message,
        });
      });
  }
);

router.delete(
  "/user",
  jwtToken,
  authenticateJWTPassport,
  lecturerAuthMiddleware,
  async (req: Request, res: Response) => {
    const userQuery = req.query;
    const id = userQuery.id;

    const schema = Joi.object({
      id: Joi.string().trim().lowercase().required().messages({
        "string.base": "User Id must be a string",
        "string.empty": "User Id cannot be empty",
        "any.required": "User Id is required",
      }),
    });

    schema
      .validateAsync({ id })
      .then(async (id) => {
        const response = await deleteUser.deleteuser(id.id);
        const { code } = response;
        res.status(code).json(response);
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
  lecturerAuthMiddleware,
  async (req: Request, res: Response) => {
    const coursesResponse = await viewCourses.viewcourses();
    const { code } = coursesResponse;
    res.status(code).json(coursesResponse);
  }
);

router.post(
  "/add-course",
  jwtToken,
  authenticateJWTPassport,
  lecturerAuthMiddleware,
  (req: Request, res: Response) => {
    const courseBody = req.body as interfaces.AddCourse;

    JoiSchema.addCourse
      .validateAsync(courseBody)
      .then(async (validatedData) => {
        const addCourseResponse = await addCourseModel.addcourse(validatedData);
        const { code } = addCourseResponse;
        res.status(code).json(addCourseResponse);
      })
      .catch((error) => {
        res.status(400).json({
          code: 400,
          message: error.details ? error.details[0].message : error.message,
        });
      });
  }
);

router.put(
  "/course",
  jwtToken,
  authenticateJWTPassport,
  lecturerAuthMiddleware,
  async (req: Request, res: Response) => {
    const id = req.query.id;
    const courseBody = req.body as interfaces.AddCourse;

    const payload = {
      id: id,
      title: courseBody.title,
      code: courseBody.code,
      cu: courseBody.cu,
    };

    JoiSchema.updateCourse
      .validateAsync(payload)
      .then(async () => {
        const payload = {
          id: id?.toString(),
          title: courseBody.title,
          code: courseBody.code,
          cu: courseBody.cu,
        };
        const updateCourseResponse = await updateCourseModel.updatecourse(
          payload
        );
        const { code } = updateCourseResponse;
        res.status(code).json(updateCourseResponse);
      })
      .catch((error) => {
        res.status(400).json({
          code: 400,
          message: error.details ? error.details[0].message : error.message,
        });
      });
  }
);

router.delete(
  "/course",
  jwtToken,
  authenticateJWTPassport,
  lecturerAuthMiddleware,
  async (req: Request, res: Response) => {
    const id = req.query.id;

    const schema = Joi.object({
      id: Joi.string().trim().lowercase().required().messages({
        "string.base": "Course Id must be a string",
        "string.empty": "Course Id cannot be empty",
        "any.required": "Course Id is required",
      }),
    });

    schema
      .validateAsync({ id })
      .then(async (id) => {
        const response = await deleteCourse.deletecourse(id.id);
        const { code } = response;
        res.status(code).json(response);
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
  "/assignment",
  jwtToken,
  authenticateJWTPassport,
  lecturerAuthMiddleware,
  async (req: Request, res: Response) => {
    const query: any = req.query.courseId;
    const reqBody = req.body as interfaces.AssignAssignment;

    const courseId: string = query;

    const payload = {
      courseId: courseId,
      name: reqBody.name,
      description: reqBody.description,
      from: reqBody.from,
      to: reqBody.to,
    };

    JoiSchema.assignmentSchema
      .validateAsync(payload)
      .then(async (data) => {
        const payload = {
          courseId: courseId,
          reqBody: data,
        };
        const response = await assignAssignment.assignAssignment(payload);
        res.status(response.code).json(response);
      })
      .catch((error: any) => {
        res.status(400).json({
          code: 400,
          message: error.details ? error.details[0].message : error.message,
        });
      });
  }
);

router.get(
  "/assignment/view",
  jwtToken,
  authenticateJWTPassport,
  lecturerAuthMiddleware,
  async (req: Request, res: Response) => {
    const response = await viewAssignment.viewassignment();
    const { code } = response;
    res.status(code).json(response);
  }
);

///continue
router.get(
  "/assignment/file",
  jwtToken,
  authenticateJWTPassport,
  lecturerAuthMiddleware,
  async (req: Request, res: Response) => {
    const studentMatric: any = req.query.matric;
    const response = await viewFile.viewfile(studentMatric);
    const filePath = response.file;
    if (filePath) {
      res.status(200).sendFile(filePath);
    } else {
      res.status(response.code).json(response);
    }
  }
);

router.get(
  "/assignment/mark",
  jwtToken,
  authenticateJWTPassport,
  lecturerAuthMiddleware,
  async (req: Request, res: Response) => {
    const reqbody: any = req.body;
    const reqUser: any = req.query;

    const payload = {
      mark: reqbody.mark,
      matric: reqUser.matric,
    };

    JoiSchema.markSchema
      .validateAsync(payload)
      .then(async (payload) => {
        const response = await markAssignment.markassignment(payload);
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

router.get("/verify-account/:token", async (req: Request, res: Response) => {
  const token: string = req.params.token;
  return await verify_mail
    .verifyUser(token)
    .then((validatedData) => {
      const { code, message } = validatedData;
      res.status(code).json({ code: code, message: message });
    })
    .catch((error: any) => {
      res.status(400).send({
        message: error.details ? error.details[0].message : error.message,
      });
    });
});

router.get("/logout", (req: Request, res: Response) => {
  res.removeHeader("x-auth-token");
  res.status(200).json({ code: 200, message: "Logout successful" });
});

export default router;
