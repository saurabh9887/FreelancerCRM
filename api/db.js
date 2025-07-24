import mysql from "mysql";

export const db = mysql.createPool({
  host: "gondola.proxy.rlwy.net",
  user: "root",
  password: "SapcHwjQrkjCzeQxtkDilJYkavpNbLspve",
  database: "railway",
  port: 34051,
});

// export const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "Saurabh@9887",
//   database: "freelanceflow",
// });

// const mysql = require("mysql2");

// const connection = mysql.createConnection({
//   host: "gondola.proxy.rlwy.net",
//   user: "root",
//   password: "pcHwjQrkjCzeQxtkDilJYkavpNbLspve",
//   database: "railway",
//   port: 34051,
// });
