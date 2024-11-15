import mongoose from "mongoose";
// import config from "config";
// import DBConfig from "../src/dtos/db_config";

// const { DB_HOST, DB_NAME }: DBConfig = config.get("DB");

const connectionString = `mongodb://mongo:nxnlsCSpfRPYZmgHiHvOMnvcFOwzDmuY@junction.proxy.rlwy.net:42617`;


// const connectionStringProduction = `mongodb+srv://harunarrasheeed:Harunausman10@cluster0.wa8st.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const connectionStringProduction =
//   `mongodb+srv://harunarrasheeed:Harunausman10@cluster0.wa8st.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

export default mongoose
  .connect(connectionString)
  .then(() => console.log("Connected to MongoDB.."))
  .catch((error) => console.log("Could not connect to MongoDB...", error));
