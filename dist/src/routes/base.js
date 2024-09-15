"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const config_1 = __importDefault(require("config"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.status(200).send(`Welcome to ${config_1.default.get("APP_NAME")} API`);
});
exports.default = router;
