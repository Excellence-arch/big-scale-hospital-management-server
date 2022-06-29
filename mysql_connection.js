const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: "hospital_management",
});

module.exports = pool;