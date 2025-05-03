import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../App.css';
import config from '../config';

function Project() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.API_ENDPOINTS.projects}/${projectId}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setProject(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const renderAttributes = (attributes) => {
    if (!attributes || Object.keys(attributes).length === 0) {
      return <p className="text-muted">No attributes</p>;
    }

    return (
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Attributes</h5>
        </div>
        <div className="card-body">
          <dl className="row mb-0">
            {Object.entries(attributes).map(([key, value]) => (
              <React.Fragment key={key}>
                <dt className="col-sm-3">{key}</dt>
                <dd className="col-sm-9">{value}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Project Details</h2>
        <Link to="/projects" className="btn btn-outline-secondary">
          Back to Projects
        </Link>
      </div>
      
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
      
      {!loading && !error && project && (
        <div>
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">{project.name}</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Project ID:</strong> {project.project_id}</p>
                </div>
                <div className="col-md-6 text-md-end">
                  <p><strong>Created:</strong> {project.createdAt ? new Date(project.createdAt).toLocaleString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {renderAttributes(project.attributes)}
          
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Actions</h5>
            </div>
            <div className="card-body">
              <button className="btn btn-primary me-2">Edit Project</button>
              <button className="btn btn-danger">Delete Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Project;