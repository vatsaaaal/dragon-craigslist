import React from 'react';
import ChatRoom from './ChatRoom';
import ChatList from './ChatList';
import './ChatPage.css';

const ChatPage = () => {
  return (
    <div className="chat-page">
      <ChatList /> {/* Left side for chat list */}
      <div className="chat-box">
        <ChatRoom /> {/* Right side for chat room */}
      </div>
    </div>
  );
};

export default ChatPage;
