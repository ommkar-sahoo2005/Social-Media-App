import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ommkar@mysql2025",
  database: "social",
});
