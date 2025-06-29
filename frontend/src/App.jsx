import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Consultation from './pages/Consultation';
import Result from './pages/Result';
import History from './pages/History';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">Sistem Pakar Stunting</h1>
            <div className="nav-links">
              <a href="/">Home</a>
              <a href="/consultation">Konsultasi</a>
              <a href="/history">Riwayat</a>
            </div>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/result" element={<Result />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
        
        <footer className="footer">
          <p>&copy; 2025 Sistem Pakar Deteksi Stunting</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;