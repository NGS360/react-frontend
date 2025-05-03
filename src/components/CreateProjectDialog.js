import React, { useState } from 'react';
import '../App.css';
import config from '../config';

function CreateProjectDialog({ show, handleClose, handleCreate }) {
  const [projectName, setProjectName] = useState('');
  const [attributes, setAttributes] = useState([{ key: '', value: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset form when dialog is opened
  React.useEffect(() => {
    if (show) {
      setProjectName('');
      setAttributes([{ key: '', value: '' }]);
      setError('');
    }
  }, [show]);

  const handleAddAttribute = () => {
    setAttributes([...attributes, { key: '', value: '' }]);
  };

  const handleRemoveAttribute = (index) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!projectName.trim()) {
      setError('Project name is required');
      return;
    }

    // Filter out empty attributes
    const filteredAttributes = attributes.filter(
      attr => attr.key.trim() !== '' && attr.value.trim() !== ''
    );

    // Convert attributes array to object
    const attributesObject = {};
    filteredAttributes.forEach(attr => {
      attributesObject[attr.key] = attr.value;
    });

    // Prepare project data
    const projectData = {
      name: projectName,
      attributes: attributesObject
    };

    try {
      setIsSubmitting(true);
      setError('');
      
      // Send data to API
      const response = await fetch(config.API_ENDPOINTS.projects, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Project created:', result);
      
      // Close dialog and pass result to parent
      handleCreate(result);
    } catch (err) {
      console.error('Error creating project:', err);
      setError(`Failed to create project: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Create New Project</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={handleClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="projectName" className="form-label">Project Name</label>
              <input
                type="text"
                className="form-control"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Attributes</label>
              {attributes.map((attr, index) => (
                <div key={index} className="attribute-row mb-2">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Key"
                      value={attr.key}
                      onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Value"
                      value={attr.value}
                      onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => handleRemoveAttribute(index)}
                      disabled={attributes.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleAddAttribute}
              >
                + Add Attribute
              </button>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateProjectDialog;