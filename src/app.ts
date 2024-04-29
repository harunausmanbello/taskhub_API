import express from "express";
import config from "config";
import dbConnection from "../config/database";


//routes modules
import baseUrl from "./routes/base_url";

dbConnection//calling the dbConnection in app.ts

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/', baseUrl);


const port: number = config.get("DB.DB_PORT") || 3000;

app.listen(port, () => console.log(`TaskHub is listening on port ${port}...`));
