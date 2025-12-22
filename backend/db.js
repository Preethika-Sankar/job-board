const mysql = require('mysql2/promise'); // ✅ use promise-based API
require('dotenv').config({ path: __dirname + '/.env' });

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

console.log("Connecting with:");
console.log("DB_HOST:", dbHost);
console.log("DB_USER:", dbUser);
console.log("DB_PASSWORD:", dbPassword ? "*****" : "NOT SET");
console.log("DB_NAME:", dbName);

const pool = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName
});

module.exports = pool; // ✅ no .promise() needed — already using promise API