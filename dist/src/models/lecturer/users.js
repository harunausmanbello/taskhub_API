"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../schema/user"));
const lodash_1 = __importDefault(require("lodash"));
exports.default = {
    viewusers: async () => {
        const users = await user_1.default.find({ isLecturer: true });
        const selectedUsers = users.map((user) => lodash_1.default.pick(user, ["_id", "firstname", "lastname", "email"]));
        if (selectedUsers.length === 0) {
            return { code: 204, message: "No user found" };
        }
        return selectedUsers;
    },
};
