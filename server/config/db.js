const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "fur_ever_match",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testDBConnection() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Connected to MySQL database.");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
}

testDBConnection();

pool.on("error", (err) => {
  console.error("❌ MySQL Pool Error:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log("🔄 Reconnecting to MySQL...");
    testDBConnection();
  } else {
    throw err;
  }
});

module.exports = pool;
