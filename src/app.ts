import express from "express";
import config from "config";
import dbConnection from "../config/database";
import helmet from "helmet";

//routes modules
import baseUrl from "./routes/base";
import signUp from "./routes/signup";
import signIn from "./routes/signin";

dbConnection; //calling the dbConnection in app.ts


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());


/* Templating Engine using ejs */
app.set('view engine', 'ejs');
app.set('views', './src/views');//setting the folder for the templates

//routes
app.use("/", baseUrl);
app.use("/signup", signUp);
app.use("/signin", signIn);

const port: number = config.get("DB.DB_PORT") || 3000;

app.listen(port, () => console.log(`TaskHub is listening on port ${port}...`));
