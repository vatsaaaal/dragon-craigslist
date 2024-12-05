import { handleSendMessage } from "./messageHandler.js";

const activeSessions = new Map();

export function setupWebSocket(io, client) {
  io.on("connection", (socket) => {

    // Handle join_room event
    socket.on("join_room", ({ userId, bookId }) => {
      if (!userId || !bookId) {
        console.error("Missing userId or bookId for join_room event");
        return;
      }

      socket.join(bookId); // Join the room identified by bookId

      // Track the session for the user
      if (!activeSessions.has(userId)) {
        activeSessions.set(userId, new Set());
      }

      const userRooms = activeSessions.get(userId);
      userRooms.add(bookId);

      console.log(`Active sessions for user ${userId}:`, Array.from(userRooms));
    });

    // Handle send_message event
    socket.on("send_message", (data) => {
      const { content, sender_id, receiver_id, room_id } = data;

      if (!content || !sender_id || !receiver_id) {
        console.error("Invalid data for send_message event", data);
        return;
      }

      // Call the message handler
      handleSendMessage(socket, io, client, data);

      // Broadcast message to the room
      io.to(room_id).emit("receive_message", { sender_id, content });
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);

      // Optional: Clean up active sessions for the user
      activeSessions.forEach((rooms, userId) => {
        rooms.delete(socket.id);
        if (rooms.size === 0) {
          activeSessions.delete(userId);
        }
      });
    });
  });
}