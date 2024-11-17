import React from 'react';
import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ChatPage from './pages/Chat/ChatPage';
import ChatRoom from './pages/Chat/ChatRoom';
import Registration from './pages/Registration';
import SignIn from './pages/SignIn';
import LandingPage from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import MarketplacePage from "./pages/Marketplace";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chatbox/:sender_id" element={<ChatRoom />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
      </Routes>
    </Router>
  );
}

export default App;
