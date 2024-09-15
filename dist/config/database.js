"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import config from "config";
// import DBConfig from "../src/dtos/db_config";
// const { DB_HOST, DB_NAME }: DBConfig = config.get("DB");
// const connectionString = `mongodb://${config.get("DB_HOST")}/${config.get(
//   "DB_NAME"
// )}`;
// mongodb+srv://harunarrasheeed:<db_password>@cluster0.fs3kc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// const connectionStringProduction = `mongodb+srv://harunarrasheeed:Harunausman10@cluster0.wa8st.mongodb.net/`
// const connectionStringProduction = `mongodb+srv://harunarrasheeed:Harunausman10@cluster0.wa8st.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const connectionStringProduction = process.env.MONGODB_URI ||
    `mongodb+srv://harunarrasheeed:Harunausman10@cluster0.wa8st.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
exports.default = mongoose_1.default
    .connect(connectionStringProduction)
    .then(() => console.log("Connected to MongoDB.."))
    .catch((error) => console.log("Could not connect to MongoDB...", error));
