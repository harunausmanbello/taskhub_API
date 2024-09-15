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
const token_1 = __importDefault(require("../validators/token"));
const authorization_1 = require("../middleware/authorization");
const JoiSchema = __importStar(require("../validators/student"));
const change_password_1 = __importDefault(require("../models/student/change_password"));
const profile_1 = __importDefault(require("../models/student/profile"));
const enroll_course_1 = __importDefault(require("../models/student/enroll_course"));
const courses_1 = __importDefault(require("../models/student/courses"));
const assignment_1 = __importDefault(require("../models/student/assignment"));
const course_assignment_1 = __importDefault(require("../models/student/course_assignment"));
const submit_assignment_1 = __importDefault(require("../models/student/submit_assignment"));
const multer_1 = __importDefault(require("../../config/multer"));
const view_grade_1 = __importDefault(require("../models/student/view_grade"));
const joi_1 = __importDefault(require("joi"));
const authenticateJWTPassport = passport_1.default.authenticate("jwt", {
    session: false,
});
const router = (0, express_1.Router)();
router.get("/dashboard", token_1.default, authenticateJWTPassport, authorization_1.studentAuthMiddleware, (req, res) => {
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
router.get("/profile", token_1.default, authenticateJWTPassport, authorization_1.studentAuthMiddleware, (req, res) => {
    const userProfile = req.user;
    if (userProfile) {
        const { firstname, lastname, matric, email } = userProfile;
        res.status(200).json({
            code: 200,
            userData: { firstname, lastname, matric, email },
        });
    }
    else {
        res.status(404).json({ code: 404, message: "User not found" });
    }
});
router.post("/profile", token_1.default, authenticateJWTPassport, authorization_1.studentAuthMiddleware, (req, res) => {
    const userData = req.user;
    const userBody = req.body;
    const payload = {
        _id: userData._id.toString(),
        firstname: userBody.firstname,
        lastname: userBody.lastname,
        matric: userBody.matric,
        email: userBody.email,
    };
    JoiSchema.updateProfile
        .validateAsync(payload)
        .then(async (validatedData) => {
        const profileData = {
            _id: userData._id,
            firstname: validatedData.firstname,
            lastname: validatedData.lastname,
            matric: validatedData.matric,
            email: validatedData.email,
        };
        const profileResponse = await profile_1.default.updateprofile(profileData);
        res.status(profileResponse.code).json(profileResponse);
    })
        .catch((error) => {
        res.status(400).json({
            code: 400,
            message: error.details ? error.details[0].message : error.message,
        });
    });
});
router.post("/change-password", token_1.default, authenticateJWTPassport, authorization_1.studentAuthMiddleware, (req, res) => {
    const userData = req.user;
    const userBody = req.body;
    const payload = {
        _id: userData._id.toString(),
        currentPassword: userBody.currentPassword,
        newPassword: userBody.newPassword,
        confirmNewPassword: userBody.confirmNewPassword,
    };
    JoiSchema.changePassword
        .validateAsync(payload)
        .then(async (validatedData) => {
        const Passwords = {
            userId: validatedData._id,
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
router.get("/courses", token_1.default, authenticateJWTPassport, authorization_1.studentAuthMiddleware, async (req, res) => {
    const userInfo = req.user;
    const _id = userInfo._id.toString();
    const schema = joi_1.default.object({
        _id: joi_1.default.string().trim().lowercase().required().messages({
            "string.base": "Student Id must be a string",
            "string.empty": "Student Id cannot be empty",
            "any.required": "Student Id is required",
        }),
    });
    schema
        .validateAsync({ _id })
        .then(async (id) => {
        const coursesResponse = await courses_1.default.viewcourses(id._id);
        res.status(200).json(coursesResponse);
    })
        .catch((error) => {
        res.status(400).json({
            code: 400,
            message: error.details ? error.details[0].message : error.message,
        });
    });
});
router.get("/enroll-course", token_1.default, authenticateJWTPassport, authorization_1.studentAuthMiddleware, async (req, res) => {
    const userInfo = req.user;
    const courseId = req.query.courseId;
    if (userInfo) {
        const { _id: studentId } = userInfo;
        const schema = joi_1.default.object({
            studentId: joi_1.default.string().trim().lowercase().required().messages({
                "string.base": "Student Id must be a string",
                "string.empty": "Student Id cannot be empty",
                "any.required": "Student Id is required",
            }),
            courseId: joi_1.default.string().trim().lowercase().required().messages({
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
            const response = await enroll_course_1.default.enrollcourse(payload);
            const { code } = response;
            res.status(code).json(response);
        })
            .catch((error) => {
            res.status(400).json({
                code: 400,
                message: error.name === "CastError" && error.kind === "ObjectId"
                    ? "Invalid course ID format"
                    : error.details
                        ? error.details[0].message
                        : error.message,
            });
        });
    }
    else {
        res.status(404).json({ code: 404, message: "User not found" });
    }
});
router.get("/assignments", token_1.default, authenticateJWTPassport, authorization_1.studentAuthMiddleware, async (req, res) => {
    const userInfo = req.user;
    const _id = userInfo._id.toString();
    const schema = joi_1.default.object({
        _id: joi_1.default.string().trim().lowercase().required().messages({
            "string.base": "Student Id must be a string",
            "string.empty": "Student Id cannot be empty",
            "any.required": "Student Id is required",
        }),
    });
    schema
        .validateAsync({ _id })
        .then(async (id) => {
        const response = await assignment_1.default.viewassignment(id);
        res.status(200).json(response);
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
router.get("/assignment", token_1.default, authenticateJWTPassport, authorization_1.studentAuthMiddleware, async (req, res) => {
    const queryParams = req.query;
    const _id = queryParams.courseId.toString();
    const schema = joi_1.default.object({
        _id: joi_1.default.string().trim().lowercase().required().messages({
            "string.base": "Course Id must be a string",
            "string.empty": "Course Id cannot be empty",
            "any.required": "Course Id is required",
        }),
    });
    schema
        .validateAsync({ _id })
        .then(async (id) => {
        const response = await course_assignment_1.default.viewcourseassignment(id);
        res.status(200).json(response);
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
router.get("/assignment/course", token_1.default, authenticateJWTPassport, authorization_1.studentAuthMiddleware, multer_1.default, async (req, res) => {
    var _a;
    const queryParams = req.query.assignmentId;
    const reqUser = req.user;
    const payload = {
        studentId: reqUser._id.toString(),
        assignmentId: queryParams,
        file: { originalname: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename },
    };
    JoiSchema.fileSchema
        .validateAsync(payload)
        .then(async (data) => {
        const payloads = {
            studentId: data.studentId,
            assignmentId: data.assignmentId,
            file: data.file,
        };
        const response = await submit_assignment_1.default.submitassignment(payloads);
        res.status(response.code).json(response);
    })
        .catch((error) => {
        res.status(400).json({
            code: 400,
            message: error.details ? error.details[0].message : error.message,
        });
    });
});
router.get("/assignment/marks", token_1.default, authenticateJWTPassport, authorization_1.studentAuthMiddleware, async (req, res) => {
    const reqUser = req.user;
    const _id = reqUser._id.toString();
    const schema = joi_1.default.object({
        _id: joi_1.default.string().trim().lowercase().required().messages({
            "string.base": "Student Id must be a string",
            "string.empty": "Student Id cannot be empty",
            "any.required": "Student Id is required",
        }),
    });
    schema
        .validateAsync({ _id })
        .then(async (id) => {
        const response = await view_grade_1.default.viewgrade(id);
        res.status(200).json(response);
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
router.get("/logout", token_1.default, authenticateJWTPassport, authorization_1.studentAuthMiddleware, (req, res) => {
    res.removeHeader("x-auth-token");
    res.status(200).json({ code: 200, message: "Logout successful" });
});
exports.default = router;
