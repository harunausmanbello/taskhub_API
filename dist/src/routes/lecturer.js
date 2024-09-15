"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const joi_1 = __importDefault(require("joi"));
const token_1 = __importDefault(require("../validators/token"));
const JoiSchema = __importStar(require("../validators/lecturer"));
const profile_1 = __importDefault(require("../models/lecturer/profile"));
const change_password_1 = __importDefault(require("../models/lecturer/change_password"));
const authorization_1 = require("../middleware/authorization");
const add_user_1 = __importDefault(require("../models/lecturer/add_user"));
const add_course_1 = __importDefault(require("../models/lecturer/add_course"));
const email_1 = __importDefault(require("../models/lecturer/email"));
const account_verification_1 = __importDefault(require("../models/lecturer/account_verification"));
const courses_1 = __importDefault(require("../models/lecturer/courses"));
const update_course_1 = __importDefault(require("../models/lecturer/update_course"));
const delete_course_1 = __importDefault(require("../models/lecturer/delete_course"));
const delete_user_1 = __importDefault(require("../models/lecturer/delete_user"));
const users_1 = __importDefault(require("../models/lecturer/users"));
const update_user_1 = __importDefault(require("../models/lecturer/update_user"));
const assignment_1 = __importDefault(require("../models/lecturer/assignment"));
const view_assignment_1 = __importDefault(require("../models/lecturer/view_assignment"));
const view_file_1 = __importDefault(require("../models/lecturer/view_file"));
const mark_assignment_1 = __importDefault(require("../models/lecturer/mark_assignment"));
const authenticateJWTPassport = passport_1.default.authenticate("jwt", {
    session: false,
});
const router = (0, express_1.Router)();
router.get("/dashboard", token_1.default, authenticateJWTPassport, authorization_1.lecturerAuthMiddleware, (req, res) => {
    const user = req.user;
    if (user) {
        const { firstname: userFirstname, lastname: userLastname } = user;
        res.status(200).json({
            code: 200,
            message: `Welcome ${userFirstname} ${userLastname}`,
        });
    }
    else {
        res.status(404).json({ code: 404, message: "User not found" });
    }
});
router.get("/profile", token_1.default, authenticateJWTPassport, authorization_1.lecturerAuthMiddleware, (req, res) => {
    const userProfile = req.user;
    if (userProfile) {
        const { firstname, lastname, email } = userProfile;
        res.status(200).json({
            code: 200,
            userData: { firstname, lastname, email },
        });
    }
    else {
        res.status(404).json({ code: 404, message: "User not found" });
    }
});
router.post("/profile", token_1.default, authenticateJWTPassport, authorization_1.lecturerAuthMiddleware, (req, res) => {
    const userData = req.user;
    const userBody = req.body;
    JoiSchema.updateProfile
        .validateAsync(userBody)
        .then(async (validatedData) => {
        const profileData = {
            _id: userData._id,
            firstname: validatedData.firstname,
            lastname: validatedData.lastname,
            email: validatedData.email,
        };
        const profileResponse = await profile_1.default.updateprofile(profileData);
        const { code } = profileResponse;
        res.status(code).json(profileResponse);
    })
        .catch((error) => {
        res.status(400).json({
            code: 400,
            message: error.details ? error.details[0].message : error.message,
        });
    });
});
router.post("/change-password", token_1.default, authenticateJWTPassport, authorization_1.lecturerAuthMiddleware, (req, res) => {
    const userData = req.user;
    const userBody = req.body;
    const payload = {
        userId: userData._id.toString(),
        currentPassword: userBody.currentPassword,
        newPassword: userBody.newPassword,
        confirmNewPassword: userBody.confirmNewPassword,
    };
    JoiSchema.changePassword
        .validateAsync(payload)
        .then(async (validatedData) => {
        const Passwords = {
            userId: validatedData.userId,
            currentPassword: validatedData.currentPassword,
            newPassword: validatedData.newPassword,
            confirmNewPassword: validatedData.confirmNewPassword,
        };
        const passwordResponse = await change_password_1.default.changepassword(Passwords);
        const { code } = passwordResponse;
        res.status(code).json(passwordResponse);
    })
        .catch((error) => {
        res.status(400).json({
            code: 400,
            message: error.details ? error.details[0].message : error.message,
        });
    });
});
router.get("/users", token_1.default, authenticateJWTPassport, authorization_1.lecturerAuthMiddleware, async (req, res) => {
    const response = await users_1.default.viewusers();
    res.status(200).json(response);
});
router.post("/add-user", token_1.default, authenticateJWTPassport, authorization_1.lecturerAuthMiddleware, (req, res) => {
    const inputBody = req.body;
    JoiSchema.addUser
        .validateAsync(inputBody)
        .then(async (validatedData) => await add_user_1.default.adduser(validatedData))
        .then(async (response) => {
        const { code, message, userData } = response;
        if (response && code === 201) {
            const addUserResponse = await email_1.default.adduser(userData);
            const { code: addUserCode, message: addUserMessage } = addUserResponse;
            res
                .status(addUserCode)
                .json({ code: addUserCode, message: addUserMessage });
        }
        else {
            res.status(code).json({ code: code, message: message });
        }
    })
        .catch((error) => {
        res.status(400).json({
            code: 400,
            message: error.details ? error.details[0].message : error.message,
        });
    });
});
router.put("/user", token_1.default, authenticateJWTPassport, authorization_1.lecturerAuthMiddleware, async (req, res) => {
    const id = req.query;
    const userBody = req.body;
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
        const response = await update_user_1.default.updateuser(payload);
        const { code } = response;
        res.status(code).json(response);
    })
        .catch((error) => {
        res.status(400).json({
            code: 400,
            message: error.details ? error.details[0].message : error.message,
        });
    });
});
router.delete("/user", token_1.default, authenticateJWTPassport, authorization_1.lecturerAuthMiddleware, async (req, res) => {
    const userQuery = req.query;
    const id = userQuery.id;
    const schema = joi_1.default.object({
        id: joi_1.default.string().trim().lowercase().required().messages({
            "string.base": "User Id must be a string",
            "string.empty": "User Id cannot be empty",
            "any.required": "User Id is required",
        }),
    });
    schema
        .validateAsync({ id })
        .then(async (id) => {
        const response = await delete_user_1.default.deleteuser(id.id);
        const { code } = response;
        res.status(code).json(response);
    })
        .catch((error) => {
        res.status(400).json({
            code: 400,
            message: error.details ? error.details[0].message : error.message,
        });
    });
});
router.get("/courses", token_1.default, authenticateJWTPassport, authorization_1.lecturerAuthMiddleware, async (req, res) => {
    const coursesResponse = await courses_1.default.viewcourses();
    const { code } = coursesResponse;
    res.status(code).json(coursesResponse);
});
router.post("/add-course", token_1.default, authenticateJWTPassport, authorization_1.lecturerAuthMiddleware, (req, res) => {
    const courseBody = req.body;
    JoiSchema.addCourse
        .validateAsync(courseBody)
        .then(async (validatedData) => {
        const addCourseResponse = await add_course_1.default.addcourse(validatedData);
        const { code } = addCourseResponse;
        res.status(code).json(addCourseResponse);
    })
        .catch((error) => {
        res.status(400).json({
            code: 400,
            message: error.details ? error.details[0].message : error.message,
        });
    });
});
router.put("/course", token_1.default, authenticateJWTPassport, authorization_1.lecturerAuthMiddleware, async (req, res) => {
    const id = req.query.id;
    const courseBody = req.body;
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
            id: id === null || id === void 0 ? void 0 : id.toString(),
            title: courseBody.title,
            code: courseBody.code,
            cu: courseBody.cu,
        };
        const updateCourseResponse = await update_course_1.default.updatecourse(payload);
        const { code } = updateCourseResponse;
        res.status(code).json(updateCourseResponse);
    })
        .catch((error) => {
        res.status(400).json({
            code: 400,
            message: error.details ? error.details[0].message : error.message,
        });
    });
});
router.delete("/course", token_1.default, authenticateJWTPassport, authorization_1.lecturerAuthMiddleware, async (req, res) => {
    const id = req.query.id;
    const schema = joi_1.default.object({
        id: joi_1.default.string().trim().lowercase().required().messages({
            "string.base": "Course Id must be a string",
            "string.empty": "Course Id cannot be empty",
            "any.required": "Course Id is required",
        }),
    });
    schema
        .validateAsync({ id })
        .then(async (id) => {
        const response = await delete_course_1.default.deletecourse(id.id);
        const { code } = response;
        res.status(code).json(response);
    })
        .catch((error) => {
        res.status(400).json({
            code: 400,
            message: error.details ? error.details[0].message : error.message,
        });
    });
});
router.post("/assignment", token_1.default, authenticateJWTPassport, authorization_1.lecturerAuthMiddleware, async (req, res) => {
    const query = req.query.courseId;
    const reqBody = req.body;
    const courseId = query;
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
        const response = await assignment_1.default.assignAssignment(payload);
        res.status(response.code).json(response);
    })
        .catch((error) => {
        res.status(400).json({
            code: 400,
            message: error.details ? error.details[0].message : error.message,
        });
    });
});
router.get("/assignment/view", token_1.default, authenticateJWTPassport, authorization_1.lecturerAuthMiddleware, async (req, res) => {
    const response = await view_assignment_1.default.viewassignment();
    const { code } = response;
    res.status(code).json(response);
});
router.get("/assignment/file", token_1.default, authenticateJWTPassport, authorization_1.lecturerAuthMiddleware, async (req, res) => {
    const reqUser = req.query;
    const _id = reqUser.matric;
    const schema = joi_1.default.object({
        _id: joi_1.default.string().trim().lowercase().required().messages({
            "string.base": "Matric Id must be a string",
            "string.empty": "Matric Id cannot be empty",
            "any.required": "Matric Id is required",
        }),
    });
    schema
        .validateAsync({ _id })
        .then(async (id) => {
        const response = await view_file_1.default.viewfile(id);
        const filePath = response.file;
        if (filePath) {
            res.status(200).sendFile(filePath);
        }
        else {
            res.status(response.code).json(response);
        }
    })
        .catch((error) => {
        res.status(400).json({
            code: 400,
            message: error.name === "CastError" && error.kind === "ObjectId"
                ? "Invalid User ID format"
                : error.details
                    ? error.details[0].message
                    : error.message,
        });
    });
});
router.get("/assignment/mark", token_1.default, authenticateJWTPassport, authorization_1.lecturerAuthMiddleware, async (req, res) => {
    const reqbody = req.body;
    const reqUser = req.query;
    const payload = {
        mark: reqbody.mark,
        matric: reqUser.matric,
    };
    JoiSchema.markSchema
        .validateAsync(payload)
        .then(async (payload) => {
        const response = await mark_assignment_1.default.markassignment(payload);
        const { code } = response;
        res.status(code).json(response);
    })
        .catch((error) => {
        res.status(400).json({
            code: 400,
            message: error.details ? error.details[0].message : error.message,
        });
    });
});
router.get("/verify-account/:token", async (req, res) => {
    const token = req.params.token;
    return await account_verification_1.default
        .verifyUser(token)
        .then((validatedData) => {
        const { code, message } = validatedData;
        res.status(code).json({ code: code, message: message });
    })
        .catch((error) => {
        res.status(400).send({
            message: error.details ? error.details[0].message : error.message,
        });
    });
});
router.get("/logout", token_1.default, authenticateJWTPassport, authorization_1.lecturerAuthMiddleware, (req, res) => {
    res.removeHeader("x-auth-token");
    res.status(200).json({ code: 200, message: "Logout successful" });
});
exports.default = router;
