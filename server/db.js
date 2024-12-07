import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export async function connectToDatabase() {
  if (!client._connected) {
    await client.connect();
    console.log("Connected to PostgreSQL successfully!");
  }
  return client;
}
