import express from "express";
import pkg from "pg";
import fs from "fs";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const { Client } = pkg;
const app = express();
const PORT = 3000;

app.use(express.json());

let client;

async function loadConfig() {
  const envConfig = JSON.parse(fs.readFileSync("env.json", "utf-8"));
  return {
    user: envConfig.PG_USER,
    host: envConfig.PG_HOST,
    database: envConfig.PG_DATABASE,
    password: envConfig.PG_PASSWORD,
    port: envConfig.PG_PORT,
  };
}

async function initializeDatabaseConnection() {
  const config = await loadConfig();
  client = new Client(config);
  await client.connect();
  console.log("Connected to PostgreSQL successfully!");
}

initializeDatabaseConnection().catch((error) => {
  console.error("Failed to connect to PostgreSQL:", error);
  process.exit(1);
});

// Use routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
