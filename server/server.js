import express from "express";
import pkg from "pg";
import fs from "fs";
import http from "http";
import { Server as SocketIOServer } from 'socket.io';
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";

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

export { client };

// Get all messages
app.get('/messages', async (req, res) => {
    try {
        const result = await client.query(
          'SELECT * FROM message ORDER BY created ASC',
        );
    
        if (result.rows.length === 0) {
          return res.status(404).json({ error: "No messages found for this user." });
        }
    
        res.json(result.rows[1]);
      } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).send('Error retrieving messages');
      }
  });

app.get('/messages/:user_id', async (req, res) => {
    const { user_id } = req.params;
  
    try {
      const result = await client.query(
        'SELECT sender_id, content FROM message WHERE sender_id = $1 OR receiver_id = $1 ORDER BY created ASC',
        [user_id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "No messages found for this user." });
      }
  
      res.json(result.rows[1]);
    } catch (error) {
      console.error('Error retrieving messages:', error);
      res.status(500).send('Error retrieving messages');
    }
  });
  

// Create a new message
app.post('/messages', async (req, res) => {
    const { content, sender_id, receiver_id } = req.body;
    try {
      const result = await client.query(
        'INSERT INTO message (content, created, sender_id, receiver_id, read_status) VALUES ($1, NOW(), $2, $3, false) RETURNING *',
        [content, sender_id, receiver_id]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).send('Error saving message.');
    }
  });

app.post("/create_room", async (req, res) => {
    const { sender_id, receiver_id = 0, product_id = 0 } = req.body; // Set default values

    // Generate the room code based on sender_id, receiver_id, and product_id
    const roomCode = generateRoomCode(sender_id, receiver_id, product_id);

    try {
        // Check if there are existing messages in the database for this room
        const result = await client.query(
            `SELECT * FROM message WHERE sender_id = $1 AND receiver_id = $2 AND product_id = $3 ORDER BY timestamp ASC`,
            [sender_id, receiver_id, product_id]
        );

        if (result.rows.length > 0) {
            // If messages exist, return them along with the room code
            rooms[roomCode] = {};  // Initialize room if not already created
            return res.json({ roomCode, messages: result.rows });
        } else {
            // If no messages exist, create a new room without historical messages
            rooms[roomCode] = {};
            return res.json({ roomCode, messages: [] });
        }
    } catch (error) {
        console.error("Error checking messages:", error);
        return res.status(500).json({ error: "Database error occurred" });
    }
});


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
