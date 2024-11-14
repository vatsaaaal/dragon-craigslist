import express from "express";
import pkg from "pg";
import fs from "fs";
import http from "http";
import { Server as SocketIOServer } from 'socket.io';
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const { Client } = pkg;
const app = express();
const server = http.createServer(app);
const PORT = 3000;

let io = new SocketIOServer(server, {
    cors: {
        origin: "http://localhost:5173", // Frontend URL
        methods: ["GET", "POST"],
        credentials: true // Allow credentials
    }
});
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

let client;
let rooms = {};

function generateRoomCode(sender_id, receiver_id, product_id) {
    return `${sender_id}-${receiver_id}-${product_id}`;
}

// Print all rooms and their sockets (for debugging purposes)
function printRooms() {
    for (let [roomId, sockets] of Object.entries(rooms)) {
        console.log(roomId);
        for (let socketId of Object.keys(sockets)) {
            console.log(`\t${socketId}`);
        }
    }
}

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
app.use("/messages", messageRoutes)

export { client };

// Socket.IO event handling
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

  // Listen for the 'join_room' event from the client
    socket.on('join_room', (room) => {
        if (room) {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
        }
  });

    socket.on("send_message", (data) => {
        const { content, user, room_id } = data;
        console.log("Data object received in send_message:", data);
        io.in(room_id).emit('receive_message', { user, content });
    });

    // Handle socket disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
  });
});
  

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})
