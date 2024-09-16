import express from "express";
import config from "config";
import dbConnection from "../config/database";
import helmet from "helmet";
import passport from "passport";
import initializePassport from "./middleware/authentication";
import updateExpiredOtps from "../config/otp";
import updateExpiredCoursesStatus from "../config/due";

//routes modules
import baseUrl from "./routes/base";
import signUp from "./routes/signup";
import signIn from "./routes/signin";
import lecturer from "./routes/lecturer";
import student from "./routes/student";

const app = express();

dbConnection; //calling the dbConnection in app.ts
initializePassport(passport); // Pass initialized Passport instance to the middleware

setInterval(() => {
  updateExpiredOtps();
  updateExpiredCoursesStatus();
}, 1000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(passport.initialize()); // passport initialization

/* Templating Engine using ejs */
app.set("view engine", "ejs");
app.set("views", "./src/views");

//routes
app.use("/", baseUrl);
app.use("/signup", signUp);
app.use("/signin", signIn);
app.use("/lecturer", lecturer);
app.use("/student", student);

const port: number = config.get("DB_PORT") || 5000;

if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode");
} else {
  console.log("Not running in production mode");
}

app.listen(port, () => console.log(`TaskHub is listening on port ${port}...`));

export default app;
