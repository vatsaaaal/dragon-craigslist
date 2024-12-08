import express from "express";
import pkg from "pg";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import { config } from "./config.js"; 
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { setupWebSocket } from "./handlers/websocket.js";
import { fileURLToPath } from "url";
import path from "path";

const { Client } = pkg;
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000; // Use Render's dynamic port or default to 3000 for local development
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cookieParser());
app.use(express.json());

// Socket.IO Setup
let io = new SocketIOServer(server, {
  cors: {
    origin: ["https://dragon-craigslist.vercel.app"], // Allow Vercel frontend and localhost
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// CORS setup
app.use(
  cors({
    origin: ["https://dragon-craigslist.vercel.app"], // Allow Vercel frontend and localhost for testing
    credentials: true, // Allow cookies and credentials
  })
);

app.use("/assets", express.static(path.join(__dirname, "../public/assets")));

app.options("*", cors());

// Initialize PostgreSQL connection
let client;

async function initializeDatabaseConnection() {
  const dbConfig = {
    connectionString: config.DATABASE_URL || `postgresql://${config.PG_USER}:${config.PG_PASSWORD}@${config.PG_HOST}:${config.PG_PORT}/${config.PG_DATABASE}`, // Use DATABASE_URL in production or build connection string for localhost
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // Use SSL in production, no SSL for local dev
  };

  client = new Client(dbConfig);
  await client.connect();
  console.log("Connected to PostgreSQL successfully!");
}

initializeDatabaseConnection().catch((error) => {
  console.error("Failed to connect to PostgreSQL:", error);
  process.exit(1);
});

// Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/messages", messageRoutes);
app.use("/admin", adminRoutes);


// WebSocket setup
setupWebSocket(io, client);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { client, config };
