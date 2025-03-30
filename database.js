import mongoose from "mongoose";

const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
let connection_string = process.env.DB_CONNECTION_STRING;

connection_string = connection_string.replace("<db_username>", db_username);
connection_string = connection_string.replace("<db_password>", db_password);

export default connection_string;

