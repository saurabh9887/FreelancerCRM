import mysql from "mysql";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Saurabh@9887",
  database: "freelanceflow",
});
