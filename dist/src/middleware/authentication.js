"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const config_1 = __importDefault(require("config"));
const user_1 = __importDefault(require("../models/schema/user"));
function configurePassport(passportInstance) {
    // Configure options for JWT strategy
    const jwtOptions = {
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromHeader("x-auth-token"),
        secretOrKey: config_1.default.get("TOKEN"),
    };
    passportInstance.use(new passport_jwt_1.Strategy(jwtOptions, (jwtPayload, done) => {
        // Find user without async/await
        user_1.default.findById(jwtPayload._id)
            .then((user) => {
            // Check if user is found
            if (!user) {
                return done(null, false, { message: "User not found" });
            }
            // If user is found, return user
            return done(null, user);
        })
            .catch((error) => {
            // Handle errors
            return done(error, false, { message: "Authentication error" });
        });
    }));
}
exports.default = configurePassport;
