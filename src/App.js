import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import CreateProjectDialog from './components/CreateProjectDialog';
import Projects from './components/Projects';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState('');
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false);
  const [projects, setProjects] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real application, you would handle the search functionality here
    console.log('Searching for:', searchQuery);
    alert(`You searched for: ${searchQuery}`);
  };

  const handleOpenCreateProjectDialog = () => {
    setShowCreateProjectDialog(true);
  };

  const handleCloseCreateProjectDialog = () => {
    setShowCreateProjectDialog(false);
  };

  const handleCreateProject = (newProject) => {
    setProjects([...projects, newProject]);
    setShowCreateProjectDialog(false);
    alert(`Project "${newProject.name}" created successfully!`);
  };

  return (
    <Router>
      <div className="App">
        {/* Bootstrap Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            {/* Logo on the left */}
            <Link className="navbar-brand d-flex align-items-center" to="/">
              <img src="/circos_color.svg" alt="NGS360 Logo" className="navbar-logo" />
              <h1 className="logo mb-0">
                <span className="logo-n">N</span>
                <span className="logo-g">G</span>
                <span className="logo-s">S</span>
                <span className="logo-3">3</span>
                <span className="logo-6">6</span>
                <span className="logo-0">0</span>
              </h1>
            </Link>
            
            {/* Navbar Toggler */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            
            {/* Navigation Links */}
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/projects">Projects</Link>
                </li>
              </ul>
            </div>
            
            
            {/* Right side of toolbar */}
            <div className="ms-auto d-flex align-items-center">
              {/* Create Project button */}
              <button
                className="btn btn-primary me-3"
                onClick={handleOpenCreateProjectDialog}
              >
                Create ProjectID
              </button>

              {/* Username input field */}
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

        {/* Routes */}
        <Routes>
          <Route path="/projects" element={<Projects />} />
          <Route path="/" element={
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
          } />
        </Routes>

        {/* Create Project Dialog */}
        <CreateProjectDialog
          show={showCreateProjectDialog}
          handleClose={handleCloseCreateProjectDialog}
          handleCreate={handleCreateProject}
        />
      </div>
    </Router>
  );
}

export default App;
