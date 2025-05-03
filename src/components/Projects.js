import React, { useState, useEffect } from 'react';
import '../App.css';
import config from '../config';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(config.API_ENDPOINTS.projects);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const renderAttributes = (attributes) => {
    if (!attributes || Object.keys(attributes).length === 0) {
      return <span className="text-muted">No attributes</span>;
    }

    return (
      <ul className="list-unstyled mb-0">
        {Object.entries(attributes).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Projects</h2>
      
      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {!loading && !error && projects.length === 0 && (
        <div className="alert alert-info" role="alert">
          No projects found. Create a new project to get started.
        </div>
      )}
      
      {!loading && !error && projects.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Name</th>
                <th>Attributes</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id || project._id}>
                  <td>{project.id || project._id}</td>
                  <td>{project.name}</td>
                  <td>{renderAttributes(project.attributes)}</td>
                  <td>{project.createdAt ? new Date(project.createdAt).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Projects;