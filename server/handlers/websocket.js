import { handleSendMessage } from "./messageHandler.js";

export function setupWebSocket(io, client) {
    io.on("connection", (socket) => {
      socket.on("join_room", (room) => {
        if (room) {
          socket.join(room);
          console.log(`User ${socket.id} joined room: ${room}`);
        }
      });
  
      socket.on("send_message", (data) => {
        const { content, sender_id, room_id, receiver_id } = data;
        console.log(data);
  
        // Call the message handler
        handleSendMessage(socket, io, client, data);
  
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
  }
  