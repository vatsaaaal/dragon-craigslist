import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './pages/Registration';
import SignIn from './pages/SignIn';
import LandingPage from './pages/Landing';


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  )
}

export default App;
