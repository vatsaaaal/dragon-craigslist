import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3000';

export const useChat = (sender_id) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the WebSocket server
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Join the specific room, e.g., '2' in your case
    newSocket.emit('join_room', sender_id);

    // Listen for incoming messages
    newSocket.on('receive_message', (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the connection when the component is unmounted
    return () => {
      newSocket.disconnect();
    };
  }, [sender_id]);

  // Function to send a message
  const sendMessage = (text) => {
    if (socket) {
      const message = { text, user: 'YourUserName', sender_id };
      socket.emit('send_message', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  return { messages, sendMessage };
};
