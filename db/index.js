const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "true"
        ? { rejectUnauthorized: false }
        : false
});

// Runs schema.sql on startup so the tables exist even on a brand
// new database (CREATE TABLE IF NOT EXISTS makes this safe to
// re-run every time the server starts).
async function runMigrations() {
    const schemaPath = path.join(__dirname, "..", "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");
    await pool.query(schema);
}

module.exports = { pool, runMigrations };