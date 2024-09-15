"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const database_1 = __importDefault(require("../config/database"));
const helmet_1 = __importDefault(require("helmet"));
const passport_1 = __importDefault(require("passport"));
const authentication_1 = __importDefault(require("./middleware/authentication"));
const otp_1 = __importDefault(require("../config/otp"));
const due_1 = __importDefault(require("../config/due"));
//routes modules
const base_1 = __importDefault(require("./routes/base"));
const signup_1 = __importDefault(require("./routes/signup"));
const signin_1 = __importDefault(require("./routes/signin"));
const lecturer_1 = __importDefault(require("./routes/lecturer"));
const student_1 = __importDefault(require("./routes/student"));
const app = (0, express_1.default)();
database_1.default; //calling the dbConnection in app.ts
(0, authentication_1.default)(passport_1.default); // Pass initialized Passport instance to the middleware
setInterval(() => {
    (0, otp_1.default)();
    (0, due_1.default)();
}, 1000);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
app.use(passport_1.default.initialize()); // passport initialization
/* Templating Engine using ejs */
app.set("view engine", "ejs");
app.set("views", "./src/views");
//routes
app.use("/", base_1.default);
app.use("/signup", signup_1.default);
app.use("/signin", signin_1.default);
app.use("/lecturer", lecturer_1.default);
app.use("/student", student_1.default);
const port = config_1.default.get("DB_PORT") || 5000;
if (process.env.NODE_ENV === 'production') {
    console.log('Running in production mode');
}
else {
    console.log('Not running in production mode');
}
app.listen(port, () => console.log(`TaskHub is listening on port ${port}...`));
