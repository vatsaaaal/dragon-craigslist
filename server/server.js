import express from "express";
import pkg from "pg";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import cookieParser from 'cookie-parser'; // Import cookie-parser
import { config } from "./config.js"; // Import config here
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import getUserIdFromToken from './middleware/getUserIdFromToken.js';

const { Client } = pkg;
const app = express();
const server = http.createServer(app);
const PORT = 3000;
app.use(cookieParser());

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
  console.log(`Socket created: ${socket.id}`);

  socket.on("join_room", (room) => {
    if (room) {
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);
    }
  });

  socket.on("send_message", (data) => {
    const { content, sender_id, room_id, receiver_id } = data;
    console.log(data);

    // Check if the socket is in the correct room
    if (!socket.rooms.has(room_id)) {
      console.error(`User ${sender_id} attempted to send a message to a room they are not part of: ${room_id}`);
      return;
    }

    io.in(room_id).emit("receive_message", { sender_id, content, receiver_id });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
