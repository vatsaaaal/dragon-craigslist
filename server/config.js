import fs from "fs";
import path from "path";

// Check if running in production
let envConfig = {};
if (process.env.NODE_ENV === "production") {
  // Use Render environment variables
  envConfig = {
    PG_USER: process.env.PG_USER,
    PG_HOST: process.env.PG_HOST,
    PG_DATABASE: process.env.PG_DATABASE,
    PG_PASSWORD: process.env.PG_PASSWORD,
    PG_PORT: process.env.PG_PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    JWT_SECRET: process.env.JWT_SECRET
  };
} else {
  // Load env.json for local development
  envConfig = JSON.parse(
    fs.readFileSync(path.resolve("env.json"), "utf-8")
  );
}

export const config = envConfig;
