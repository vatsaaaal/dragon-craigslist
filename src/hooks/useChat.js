  import { useState, useEffect } from 'react';
  import io from 'socket.io-client';
  import axios from 'axios';

  const SOCKET_SERVER_URL = 'http://localhost:3000';
  const DEFAULT_ROOM_CODE = 'test_room';
  const user_id = "123";
  const receiver_id = "1";
  const product_id = "789"; 

  function generateRoomCode(user_id, receiver_id, product_id) {
    return `${user_id}_${receiver_id}_${product_id}`; // Using template literals to concatenate
  }

  export const useChat = (room_code = DEFAULT_ROOM_CODE) => {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
          // Function to fetch the user_id from the server using the stored token
    const fetchUserId = async () => {
      try {
        // Replace this URL with the endpoint on your server that verifies the token
        const response = await axios.get('http://localhost:3000/messages/user', {
          withCredentials: true, // This ensures cookies are included
        });
        
        if (response.data && response.data.userId) {
          setCurrentUserId(response.data.userId);
        } else {
          console.error('Failed to retrieve userId from server');
        }
      } catch (error) {
        console.error('Error fetching userId:', error);
      }
    };

    // Fetch the user_id when the component is first rendered
    fetchUserId();
  }, []);

    useEffect(() => {
      if (!currentUserId) 
        return; // Don't initialize socket until we have userId
      
      // Connect to the WebSocket server
      const newSocket = io(SOCKET_SERVER_URL);
      setSocket(newSocket);

      newSocket.emit('join_room', room_code);

      // Listen for incoming messages
      newSocket.on('receive_message', (message) => {
        if (message.user === currentUserId) {
          console.log("Your message:", message);
        } else {
          console.log("Message from other user:", message);
        }
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Clean up the connection when the component is unmounted
      return () => {
        newSocket.disconnect();
      };
    }, [room_code, currentUserId]);

    // Function to send a message
    const sendMessage = (content) => {
      if (socket && currentUserId) {
        const message = { content, user: currentUserId, receiver: receiver_id, room_id: room_code};
        socket.emit('send_message', message); // Emit the message with room_id
      }
      
    };

    return { messages, sendMessage };
  };