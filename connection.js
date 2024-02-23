const pool = require("pg").Pool;

const conn = new pool({
  user: "postgres",
  password: "Dev@123456#htvb",
  server: "localhost",
  database: "plooraldev",
  port: 5432
});

module.exports = conn;