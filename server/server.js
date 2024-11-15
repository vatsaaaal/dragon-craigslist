import express from "express";
import pkg from "pg";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import { config } from "./config.js"; // Import config here
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const { Client } = pkg;
const app = express();
const server = http.createServer(app);
const PORT = 3000;

let io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

let client;

async function initializeDatabaseConnection() {
  const dbConfig = {
    user: config.PG_USER,
    host: config.PG_HOST,
    database: config.PG_DATABASE,
    password: config.PG_PASSWORD,
    port: config.PG_PORT,
  };

  client = new Client(dbConfig);
  await client.connect();
  console.log("Connected to PostgreSQL successfully!");
}

initializeDatabaseConnection().catch((error) => {
  console.error("Failed to connect to PostgreSQL:", error);
  process.exit(1);
});

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/messages", messageRoutes);

export { client, config }; // Export client and config

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    if (room) {
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);
    }
  });

  socket.on("send_message", (data) => {
    const { content, user, room_id } = data;
    console.log("Data object received in send_message:", data);
    io.in(room_id).emit("receive_message", { user, content });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
