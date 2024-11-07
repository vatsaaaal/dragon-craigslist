import React from 'react';
import ChatRoom from './ChatRoom'; // Import ChatRoom component
import './ChatPage.css';

const ChatPage = () => {
  return (
    <div className="chat-page">
      <div className="chat-box">
        <h1>Welcome to the Chat Page</h1>
        <p>This is the chat interface.</p>
        <ChatRoom /> {/* Embed ChatRoom component here */}
      </div>
    </div>
  );
};

export default ChatPage;
