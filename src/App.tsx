// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AIEmployeeForm from '../src/pages/Demo.js';
import Home from './pages/Home';
import Demo from './pages/Demo'; // Import the new Demo page
import { ConsolePage } from './pages/ConsolePage'; // Import ConsolePage correctly as a named export
import './App.scss';

function App() {
  return (
    // Wrap the entire application with FormProvider to provide context
   
      <Router>
        <div data-component="App">
          {/* Navigation Links */}
          <nav>
            <ul className="nav-row">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/demo">Demo</Link> {/* Add Link to Demo Page */}
              </li>
            </ul>
          </nav>

          {/* Define Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/demo" element={<Demo />} /> {/* Add Route for Demo Page */}
            <Route path="/console" element={<ConsolePage />} /> {/* Add Route for ConsolePage */}
          </Routes>
        </div>
      </Router>
  );
}

export default App;