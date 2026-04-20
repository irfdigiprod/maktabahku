import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

async function initDb() {
  console.log("Connecting to MySQL...");
  
  // Connect without database first
  let connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true
  });

  console.log("Creating database if not exists...");
  await connection.query("CREATE DATABASE IF NOT EXISTS maktabahku;");
  
  console.log("Using maktabahku database...");
  await connection.query("USE maktabahku;");

  console.log("Loading schema.sql...");
  const schemaPath = path.join(import.meta.dir, "schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf-8");

  console.log("Executing schema.sql...");
  await connection.query(schemaSql);

  console.log("Database initialized successfully!");
  await connection.end();
}

initDb().catch(console.error);
