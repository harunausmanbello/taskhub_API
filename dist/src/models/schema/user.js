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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Schema for user registration
const schema = new mongoose_1.Schema({
    firstname: {
        type: String,
        minlength: 3,
        lowercase: true,
        required: true,
    },
    lastname: {
        type: String,
        minlength: 3,
        lowercase: true,
        required: true,
    },
    isLecturer: {
        type: Boolean,
        default: false,
    },
    matric: {
        type: String,
        minlength: 11,
        maxlength: 11,
        lowercase: true,
        unique: true,
        required: function () {
            return !this.isLecturer;
        },
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        lowercase: true,
        unique: true,
    },
    token: {
        type: String,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 244,
        required: true,
    },
});
// Model for user registration
const User = mongoose_1.default.model("users", schema);
exports.default = User;
