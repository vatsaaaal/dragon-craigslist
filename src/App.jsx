import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatPage from './pages/Chat/ChatPage';
import ChatRoom from './pages/Chat/ChatRoom';

// Placeholder HomePage component
const HomePage = () => {
  return <h1>Welcome to the Home Page</h1>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chatbox" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;