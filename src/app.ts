import express from "express";
import config from "config";
import dbConnection from "../config/database";

dbConnection//calling the dbConnection in app.ts

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port: number = config.get("DB.DB_PORT") || 2000;

app.listen(port, () => console.log(`TaskHub is listening on port ${port}...`));
