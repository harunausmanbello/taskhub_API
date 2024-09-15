"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const submits_1 = __importDefault(require("../schema/submits"));
const lodash_1 = __importDefault(require("lodash"));
exports.default = {
    submitassignment: async (payload) => {
        const submitAssignment = new submits_1.default({
            studentId: lodash_1.default.get(payload, "studentId"),
            assignmentId: lodash_1.default.get(payload, "assignmentId"),
            file: lodash_1.default.get(payload, "file.originalname"),
        });
        return await submitAssignment
            .save()
            .then(() => {
            return {
                code: 201,
                message: `You have successfully submitted your assignment..`,
            };
        })
            .catch((error) => {
            var _a, _b, _c;
            const errorMessage = error.code === 11000 && error.keyPattern.assignmentId
                ? `You have already submitted your assignment for this course.`
                : ((_c = (_b = (_a = error.details) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.status) ||
                    error.message ||
                    "Unknown error occurred.";
            return {
                code: error.code === 11000 ? 409 : 500,
                message: errorMessage,
            };
        });
    },
};
