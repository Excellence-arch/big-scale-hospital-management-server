const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: process.env.USERS,
  password: process.env.PASSWORD,
  database: "hospital_management",
});

module.exports = pool;