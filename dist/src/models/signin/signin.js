"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const password_complexity_1 = __importDefault(require("../../validators/password_complexity"));
const signin_1 = __importDefault(require("../../validators/signin"));
const user_1 = __importDefault(require("../schema/user"));
exports.default = {
    signin: async (signinBody) => {
        const { email, password } = lodash_1.default.pick(signinBody, [
            "email",
            "password",
        ]);
        return (0, password_complexity_1.default)(signinBody.password)
            ? signin_1.default
                .validateAsync(signinBody)
                .then(async () => {
                const user = await user_1.default.findOne({
                    email: email,
                });
                if (!user) {
                    return {
                        code: 404,
                        message: "Invalid Email or Password",
                    };
                }
                const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    return {
                        code: 404,
                        message: "Invalid Email or Password",
                    };
                }
                if (!user.isVerified) {
                    return {
                        code: 403,
                        message: "Account Not Verified: Please verify your account to proceed",
                    };
                }
                if (user && isPasswordValid && user.isVerified) {
                    const tokenFromConfig = config_1.default.get("TOKEN");
                    const token = jsonwebtoken_1.default.sign({
                        _id: user._id,
                        email: user.email,
                        isLecturer: user.isLecturer,
                    }, tokenFromConfig);
                    return {
                        code: 200,
                        token: token,
                        userData: {
                            _id: user._id,
                            email: user.email,
                        },
                    };
                }
                else {
                    return {
                        code: 404,
                        message: "Your account has not been verified. Please click the button sent to your email again",
                    };
                }
            })
                .catch((error) => {
                return {
                    code: 400,
                    message: error.details ? error.details[0].message : error.message,
                };
            })
            : "Invalid Password check";
    },
};
