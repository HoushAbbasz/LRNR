import mysql from "mysql2/promise";
import "dotenv/config";

// Creates a pool of reusable MySQL connections using credentials from .env
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default db;