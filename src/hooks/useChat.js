import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const SOCKET_SERVER_URL = 'http://localhost:3000';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch the user ID when the component is mounted
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/me', {
          withCredentials: true,
        });

        if (response.data && response.data.user_id) {
          setCurrentUserId(response.data.user_id);
        } else {
          console.error('Failed to retrieve userId from server');
        }
      } catch (error) {
        console.error('Error fetching userId:', error.message);
      }
    };

    fetchUserId();
  }, []);

  // Set up WebSocket connection and join the room
  useEffect(() => {
    const bookInfo = JSON.parse(sessionStorage.getItem('bookInfo'));

    // Ensure required variables are available
    if (!currentUserId || !bookInfo || !bookInfo.bookId) return;

    const { bookId } = bookInfo;

    console.log('Initializing WebSocket connection...');
    const newSocket = io(SOCKET_SERVER_URL, {
      query: { userId: currentUserId }, // Pass userId as part of the query
    });
    setSocket(newSocket);

    // Join the room with bookId and userId
    newSocket.emit('join_room', { bookId: bookId, userId: currentUserId });

    // Listen for incoming messages
    newSocket.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up on component unmount or dependency change
    return () => {
      console.log('Disconnecting WebSocket connection...');
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [currentUserId]);

  // Function to send a message
  const sendMessage = async (content) => {
    const bookInfo = JSON.parse(sessionStorage.getItem('bookInfo'));
    if (!bookInfo || !bookInfo.bookId || !socket) {
      console.error('Cannot send message: Missing bookId or WebSocket connection');
      return;
    }

    const { bookId, sellerId } = bookInfo;

    const message = {
      content,
      sender_id: currentUserId,
      receiver_id: sellerId,
      room_id: bookId
    };

    // Send the message through WebSocket
    socket.emit('send_message', message);

    // Optionally store the message on the server
    try {
      const response = await axios.post(
        'http://localhost:3000/messages/',
        message,
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        console.log('Message successfully stored:', response.data);
      } else {
        console.error(`Unexpected status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error storing message:', error.message);
    }
  };

  return { messages, sendMessage };
};
