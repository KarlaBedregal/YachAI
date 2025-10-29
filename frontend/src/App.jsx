import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GameSession from './pages/GameSession';
import Profile from './pages/Profile';
import './styles/globals.css';
import { useUserStore } from './store/userStore'; 


function App() {
  const { user } = useUserStore();

  return (
    <Router>
      <Routes>
        {/* Ruta inicial - Registro */}
        <Route path="/" element={<Home />} />
        
        {/* Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/game-session" 
          element={user ? <GameSession /> : <Navigate to="/" />} 
        />
        <Route 
          path="/profile" 
          element={user ? <Profile /> : <Navigate to="/" />} 
        />
        
        {/* Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;