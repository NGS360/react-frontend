import React, { useState } from 'react';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real application, you would handle the search functionality here
    console.log('Searching for:', searchQuery);
    alert(`You searched for: ${searchQuery}`);
  };

  return (
    <div className="App">
      {/* Bootstrap Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          {/* Logo on the left */}
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src="/circos_color.svg" alt="NGS360 Logo" className="navbar-logo" />
            <h1 className="logo mb-0">
              <span className="logo-n">N</span>
              <span className="logo-g">G</span>
              <span className="logo-s">S</span>
              <span className="logo-3">3</span>
              <span className="logo-6">6</span>
              <span className="logo-0">0</span>
            </h1>
          </a>
          
          {/* Username field on the right */}
          <div className="ms-auto">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button className="btn btn-outline-secondary" type="button">
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Container */}
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <div className="search-box-container">
            <input
              type="text"
              className="form-control search-box"
              placeholder="Search NGS360..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
              size="45" /* Explicitly set size to accommodate 45 characters */
            />
            <button
              className="btn btn-outline-secondary clear-button"
              type="button"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          </div>
          
          <div className="button-container">
            <button type="submit" className="btn btn-light search-button">
              Search
            </button>
            <button type="button" className="btn btn-light search-button">
              I'm Feeling Lucky
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
