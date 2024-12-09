import { handleSendMessage } from "./messageHandler.js";

export function setupWebSocket(io, client) {
  io.on("connection", (socket) => {

    // Handle join_room event
    socket.on("join_room", ({ room_id }) => {
      if (!room_id) {
        console.error("Missing room_id");
        return;
      }
      socket.join(room_id); // Join the room identified by bookId
    });

    // Handle send_message event
    socket.on("send_message", (data) => {
      const { content, sender_id, room_id, sender_username, created } = data;

      if (!content || !sender_id || !room_id) {
        console.error("Invalid data for send_message event", data);
        return;
      }

      // Call the message handler
      handleSendMessage(socket, io, client, data);

      // Broadcast message to the room
      io.to(room_id).emit("receive_message", { sender_id, content, sender_username, created });
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}