import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const SOCKET_SERVER_URL = 'http://localhost:3000';
const DEFAULT_ROOM_CODE = 'test_room';
const user_id = "123";
const receiver_id = 1;
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
      const response = await axios.get('http://localhost:3000/users/me', {
        withCredentials: true, // This ensures cookies are included
      });
      
      if (response.data && response.data.user_id) {
        setCurrentUserId(response.data.user_id);
      } else {
        console.error('Failed to retrieve userId from server');
      }
    } catch (error) {
      console.error("You are not logged in");
    }
  };

  // Fetch the user_id when the component is first rendered
  fetchUserId();
}, []);

  useEffect(() => {
    if (!currentUserId) 
      return; // Don't initialize socket until we have userId
    
    console.log('Initializing WebSocket connection...');
    // Connect to the WebSocket server
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.emit('join_room', room_code);

    // Listen for incoming messages
    newSocket.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the connection when the component is unmounted
    return () => {
      console.log('Disconnecting WebSocket connection...');
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [room_code, currentUserId]);

  // Function to send a message
  const sendMessage = async (content) => {
    if (socket && currentUserId) {
      const message = { content, sender_id: currentUserId, receiver_id: receiver_id, room_id: room_code};
      socket.emit('send_message', message); // Emit the message with room_id
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/messages/',
        {
          content,          // Replace with actual content
          sender_id: currentUserId,  // Use actual sender ID
          receiver_id,      // Use actual receiver ID
        },
        {
          withCredentials: true, // This ensures cookies are included
        }
      );
  
      // Check the status of the response
      if (response.status === 200 || response.status === 201) {
        console.log('Message successfully stored:', response.data);
      } else {
        console.error(`Unexpected status: ${response.status}`);
      }
    } catch (error) {
      // Handle errors (e.g., network errors or server issues)
      if (error.response) {
        // Server responded with a status code outside 2xx range
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        // No response received from the server
        console.error('No response received:', error.request);
      } else {
        // Other errors
        console.error('Error:', error.message);
      }
    }
  };

  return { messages, sendMessage };
};