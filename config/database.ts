import mongoose from "mongoose";
import config from "config";
// import DBConfig from "../src/dtos/db_config";

// const { DB_HOST, DB_NAME }: DBConfig = config.get("DB");

const connectionString = `mongodb://${config.get("DB_HOST")}/${config.get(
  "DB_NAME"
)}`;

// const connectionString = `mongodb://${DB_HOST}/${DB_NAME}`;

export default mongoose
  .connect(connectionString)
  .then(() => console.log("Connected to MongoDB.."))
  .catch((error) => console.log("Could not connect to MongoDB...", error));
