"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const password_complexity_1 = __importDefault(require("../../validators/password_complexity"));
const lecturer_1 = require("../../validators/lecturer");
const user_1 = __importDefault(require("../schema/user"));
exports.default = {
    adduser: async (addUserBody) => {
        return (0, password_complexity_1.default)(addUserBody.password)
            ? lecturer_1.addUser
                .validateAsync(addUserBody)
                .then(async () => {
                const salt = await bcrypt_1.default.genSalt(10);
                const hashedPassword = await bcrypt_1.default.hash(addUserBody.password, salt);
                const newUser = new user_1.default(Object.assign(Object.assign({}, lodash_1.default.pick(addUserBody, [
                    "firstname",
                    "lastname",
                    "email",
                    "isLecturer",
                ])), { password: hashedPassword }));
                return newUser
                    .save()
                    .then((user) => {
                    return {
                        code: 201,
                        userData: {
                            _id: user._id,
                            email: user.email,
                        },
                    };
                })
                    .catch((error) => {
                    var _a, _b, _c;
                    const errorMessage = error.code === 11000 && error.keyPattern.email
                        ? "The email address provided already exists."
                        : ((_c = (_b = (_a = error.details) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.status) ||
                            error.message ||
                            "Unknown error occurred.";
                    return {
                        code: 409,
                        message: errorMessage,
                    };
                });
            })
                .catch((error) => {
                return {
                    code: 400,
                    message: error.details
                        ? error.details[0].message.status
                        : error.message,
                };
            })
            : { code: 400, message: "Password not validated" };
    },
};
