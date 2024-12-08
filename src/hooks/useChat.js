import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const SOCKET_SERVER_URL = 'https://dragon-craigslist.onrender.com';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUsername, setCurrentUsername] = useState('');

  // Fetch the user ID when the component is mounted
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get('https://dragon-craigslist.onrender.com/users/me', {
          withCredentials: true,
        });

        if (response.data && response.data.user_id) {
          setCurrentUserId(response.data.user_id);
          setCurrentUsername(response.data.username);
        } else {
          console.error('Failed to retrieve userId from server');
        }
      } catch (error) {
        console.error('Error fetching userId:', error.message);
      }
    };

    fetchUserId();
  }, []);

  // Fetch historical messages
  useEffect(() => {
    const bookInfo = JSON.parse(sessionStorage.getItem('bookInfo'));
    const bookId = bookInfo?.bookId;
    const otherUserId = bookInfo?.sellerId;

    const fetchHistoricalMessages = async () => {
      try {
        const response = await axios.get(`https://dragon-craigslist.onrender.com/messages/past_messages/${bookId}`, {
          params: { other_user_id: otherUserId },
          withCredentials: true,
        });
        setMessages(response.data); // Set historical messages
      } catch (error) {
        console.error('Error fetching historical messages:', error.message);
      }
    };

    if (bookId && currentUserId) {
      fetchHistoricalMessages();
    }
  }, [currentUserId]);

  // Set up WebSocket connection and join the room
  useEffect(() => {
    const bookInfo = JSON.parse(sessionStorage.getItem('bookInfo'));

    const room_id = bookInfo?.bookId;

    // Ensure required variables are available
    if (!currentUserId || !bookInfo || !bookInfo.bookId) return;


    console.log('Initializing WebSocket connection...');
    const newSocket = io(SOCKET_SERVER_URL, {
      query: { userId: currentUserId }, // Include user-specific data if needed
      transports: ["websocket"], // Enforce WebSocket protocol
    });
    
    setSocket(newSocket);

    // Join the room room_id
    newSocket.emit('join_room', { room_id });

    // Listen for incoming messages
    newSocket.on('receive_message', (message) => {
      console.log('Received message:', message);
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
    const productInfo = JSON.parse(sessionStorage.getItem('productInfo'));

    const bookId = productInfo?.product_id || bookInfo?.bookId;

    if (!bookInfo || !bookInfo.bookId ) {
      console.error('Cannot send message: Missing bookId or WebSocket connection');
      return;
    }

    const sellerId = bookInfo?.sellerId;

    const message = {
      content,
      sender_id: currentUserId,
      receiver_id: sellerId,
      room_id: bookId,
      sender_username: currentUsername
    };

    // Send the message through WebSocket
    socket.emit('send_message', message);

    // Optionally store the message on the server
    try {
      const response = await axios.post(
        'https://dragon-craigslist.onrender.com/messages/',
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
