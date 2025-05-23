# Complete Projects.js Implementation with Pagination

Below is the complete implementation of the Projects.js file with pagination functionality:

```javascript
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import config from '../config';

function Projects() {
  // Project data state
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Sorting state
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchProjects(currentPage, perPage, sortBy, sortOrder);
  }, []); // Empty dependency array to run only once on component mount

  const fetchProjects = async (page = currentPage, itemsPerPage = perPage, sort = sortBy, order = sortOrder) => {
    try {
      setLoading(true);
      const url = new URL(config.API_ENDPOINTS.projects, window.location.origin);
      url.searchParams.append('page', page);
      url.searchParams.append('per_page', itemsPerPage);
      url.searchParams.append('sort_by', sort);
      url.searchParams.append('sort_order', order);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract projects array from the response
      if (data && data.projects) {
        setProjects(data.projects);
        
        // Extract pagination information
        if (data.pagination) {
          setTotalItems(data.pagination.total_items);
          setTotalPages(data.pagination.total_pages);
          setCurrentPage(data.pagination.current_page);
        }
      } else {
        setProjects([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    const newSortOrder = column === sortBy && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(column);
    setSortOrder(newSortOrder);
    fetchProjects(currentPage, perPage, column, newSortOrder);
  };

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

  // Pagination controls component
  const PaginationControls = () => {
    // Generate limited page numbers with ellipses for large page counts
    const getPageNumbers = () => {
      const maxPagesToShow = 5; // Show at most 5 page numbers at once
      const pageNumbers = [];
      
      if (totalPages <= maxPagesToShow) {
        // If we have fewer pages than our limit, show all pages
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push({ type: 'page', value: i });
        }
      } else {
        // Always show first page
        pageNumbers.push({ type: 'page', value: 1 });
        
        // Calculate start and end of pages to show
        let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3);
        
        // Adjust if we're near the beginning
        if (startPage === 2) {
          endPage = Math.min(totalPages - 1, maxPagesToShow - 1);
        }
        
        // Adjust if we're near the end
        if (endPage === totalPages - 1) {
          startPage = Math.max(2, totalPages - maxPagesToShow + 2);
        }
        
        // Add ellipsis if needed at the beginning
        if (startPage > 2) {
          pageNumbers.push({ type: 'ellipsis', value: '...' });
        }
        
        // Add pages in the middle
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push({ type: 'page', value: i });
        }
        
        // Add ellipsis if needed at the end
        if (endPage < totalPages - 1) {
          pageNumbers.push({ type: 'ellipsis', value: '...' });
        }
        
        // Always show last page
        pageNumbers.push({ type: 'page', value: totalPages });
      }
      
      return pageNumbers;
    };
    
    const pageNumbers = getPageNumbers();
    
    // Handle page change
    const handlePageChange = (page) => {
      if (page !== currentPage) {
        setCurrentPage(page);
        fetchProjects(page, perPage, sortBy, sortOrder);
      }
    };
    
    // Handle items per page change
    const handlePerPageChange = (e) => {
      const newPerPage = parseInt(e.target.value, 10);
      setPerPage(newPerPage);
      setCurrentPage(1); // Reset to first page
      fetchProjects(1, newPerPage, sortBy, sortOrder);
    };
    
    return (
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="d-flex align-items-center">
          <span className="me-2">Items per page:</span>
          <select 
            className="form-select form-select-sm" 
            value={perPage} 
            onChange={handlePerPageChange}
            style={{ width: 'auto' }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        
        <nav aria-label="Projects pagination">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            
            {pageNumbers.map((item, index) => (
              item.type === 'ellipsis' ? (
                <li key={`ellipsis-${index}`} className="page-item disabled">
                  <span className="page-link">{item.value}</span>
                </li>
              ) : (
                <li key={item.value} className={`page-item ${currentPage === item.value ? 'active' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(item.value)}
                  >
                    {item.value}
                  </button>
                </li>
              )
            ))}
            
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
        
        <div>
          <span>
            Showing {projects.length} of {totalItems} items
          </span>
        </div>
      </div>
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
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th onClick={() => handleSort('project_id')} style={{ cursor: 'pointer' }}>
                    Project ID {sortBy === 'project_id' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Attributes</th>
                  <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                    Created At {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => {
                  const projectId = project.project_id || project.id || project._id;
                  return (
                    <tr
                      key={projectId}
                      className="cursor-pointer"
                      onClick={() => window.location.href = `/project/${projectId}`}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <Link to={`/project/${projectId}`} className="text-decoration-none">
                          {projectId}
                        </Link>
                      </td>
                      <td>{project.name}</td>
                      <td>{renderAttributes(project.attributes)}</td>
                      <td>{project.createdAt ? new Date(project.createdAt).toLocaleString() : 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <PaginationControls />
        </>
      )}
    </div>
  );
}

export default Projects;
```

## Key Changes Made

1. **Added State Variables for Pagination and Sorting**
   - Added state for currentPage, perPage, totalItems, totalPages
   - Added state for sortBy and sortOrder

2. **Updated fetchProjects Function**
   - Modified to accept pagination and sorting parameters
   - Added URL parameter handling for API requests
   - Updated to extract and store pagination information from the response

3. **Added Sorting Functionality**
   - Added handleSort function to manage column sorting
   - Updated table headers to be clickable for sorting
   - Added visual indicators for sort direction

4. **Added PaginationControls Component**
   - Created a nested component for pagination UI
   - Implemented smart pagination with ellipses for large page counts
   - Added "Items per page" selector
   - Added Previous/Next buttons
   - Added page count information

5. **Updated UI Structure**
   - Added PaginationControls below the table
   - Wrapped table and pagination in a fragment

This implementation provides a complete solution for handling paginated API responses and offering users a full set of pagination controls.