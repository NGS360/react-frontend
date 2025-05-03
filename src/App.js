import React, { useState } from 'react';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real application, you would handle the search functionality here
    console.log('Searching for:', searchQuery);
    alert(`You searched for: ${searchQuery}`);
  };

  return (
    <div className="App">
      <div className="search-container">
        <div className="logo-container">
          <h1 className="logo">NGS360</h1>
        </div>
        
        <form onSubmit={handleSearch}>
          <div className="input-group search-box-container">
            <input
              type="text"
              className="form-control search-box"
              placeholder="Search NGS360..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button" onClick={() => setSearchQuery('')}>
                <i className="fa fa-times"></i>
                ✕
              </button>
            </div>
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
