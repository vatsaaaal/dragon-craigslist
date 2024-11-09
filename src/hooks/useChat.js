  import { useState, useEffect } from 'react';
  import io from 'socket.io-client';

  const SOCKET_SERVER_URL = 'http://localhost:3000';
  const DEFAULT_ROOM_CODE = 'test_room';

  export const useChat = (room_code = DEFAULT_ROOM_CODE) => {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
  
    console.log("Sender ID in useChat:", room_code);

    useEffect(() => {
      // Connect to the WebSocket server
      const newSocket = io(SOCKET_SERVER_URL);
      setSocket(newSocket);

      // Join the specific room, e.g., '2' in your case
      newSocket.emit('join_room', room_code);

      // Listen for incoming messages
      newSocket.on('receive_message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Clean up the connection when the component is unmounted
      return () => {
        newSocket.disconnect();
      };
    }, [room_code]);

    // Function to send a message
    const sendMessage = (content) => {
      if (socket) {
        const message = { content, user: 'YourUserName', room_id: room_code }; // Correct the key to room_id
        socket.emit('send_message', message); // Emit the message with room_id
      }
    };

    return { messages, sendMessage };
  };