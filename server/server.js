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

app.post('/send_message', getUserIdFromToken, async (req, res) => {
  const { content, receiver_id } = req.body;
  const user_id = req.user.userId;
  console.log(req);

  if (!content || !receiver_id) {
      return res.status(400).json({ message: 'Content and receiver_id are required.' });
  }

  try {
    // Save the message to the database
    const query = `
      INSERT INTO message (sender_id, receiver_id, content)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [user_id, receiver_id, content];
    const result = await client.query(query, values);
    const savedMessage = result.rows[0];
    console.log(savedMessage);

    // Emit the message to the room
    io.in(room_id).emit("receive_message", {
      user: user_id,
      content: savedMessage.content,
      timestamp: savedMessage.timestamp,
    });

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

io.on("connection", (socket) => {
  console.log(`Socket created: ${socket.id}`);

  socket.on("join_room", (room) => {
    if (room) {
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);
    }
  });

  socket.on("send_message", (data) => {
    const { content, user, room_id } = data;
    console.log(data);

    // Check if the socket is in the correct room
    if (!socket.rooms.has(room_id)) {
      console.error(`User ${user} attempted to send a message to a room they are not part of: ${room_id}`);
      return;
    }

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
