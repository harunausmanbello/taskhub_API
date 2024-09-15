"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lecturerAuthMiddleware = exports.studentAuthMiddleware = void 0;
// Middleware function to authorize access for students
const studentAuthMiddleware = (req, res, next) => {
    const isStudent = req.user.isLecturer === false;
    if (!isStudent) {
        return res.status(403).json({ code: 403, message: "Access denied" });
    }
    next();
};
exports.studentAuthMiddleware = studentAuthMiddleware;
// Middleware function to authorize access for lecturers
const lecturerAuthMiddleware = (req, res, next) => {
    const isLecturer = req.user.isLecturer === true;
    if (!isLecturer) {
        return res.status(403).json({ code: 403, message: "Access denied." });
    }
    next();
};
exports.lecturerAuthMiddleware = lecturerAuthMiddleware;
