"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers["x-auth-token"];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    jsonwebtoken_1.default.verify(token, config_1.default.get("TOKEN"), (err, payload) => {
        if (err) {
            return res
                .status(401)
                .json({ message: "The token provided is invalid." });
        }
        req.payloadData = payload;
        next();
    });
};
exports.default = verifyToken;
