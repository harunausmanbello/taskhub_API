import express from "express";
import config from "config";
import dbConnection from "../config/database";
import helmet from "helmet";

//routes modules
import baseUrl from "./routes/base_url";
import signUp from "./routes/signup";

dbConnection; //calling the dbConnection in app.ts

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

//routes
app.use("/", baseUrl);
app.use("/signup", signUp);

const port: number = config.get("DB.DB_PORT") || 3000;

app.listen(port, () => console.log(`TaskHub is listening on port ${port}...`));
