import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3000';

export const useChat = (productId) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the WebSocket server
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Join the specific product room
    newSocket.emit('join_room', productId);

    // Listen for incoming messages
    newSocket.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the connection when the component is unmounted
    return () => {
      newSocket.disconnect();
    };
  }, [productId]);

  // Function to send a message
  const sendMessage = (text) => {
    if (socket) {
      const message = { text, user: 'YourUserName', productId };
      socket.emit('send_message', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  return { messages, sendMessage };
};
