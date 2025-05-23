# Plan for Implementing Pagination in Projects Component

## 1. Update State Management in Projects Component

We need to add new state variables to track pagination information:

```javascript
// New state variables
const [currentPage, setCurrentPage] = useState(1);
const [perPage, setPerPage] = useState(20);
const [totalItems, setTotalItems] = useState(0);
const [totalPages, setTotalPages] = useState(0);
const [sortBy, setSortBy] = useState('id');
const [sortOrder, setSortOrder] = useState('asc');
```

## 2. Update fetchProjects Function

The `fetchProjects` function needs to be updated to:
- Accept pagination parameters
- Pass these parameters to the API
- Extract and store pagination information from the response

```javascript
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
```

## 3. Add Pagination UI Controls

We'll add a pagination component at the bottom of the projects table:

```jsx
// Pagination component
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
```

## 4. Update useEffect to Call fetchProjects

We need to update the useEffect hook to call our updated fetchProjects function:

```javascript
useEffect(() => {
  fetchProjects(currentPage, perPage, sortBy, sortOrder);
}, []); // Empty dependency array to run only once on component mount
```

## 5. Add Sorting Functionality (Optional Enhancement)

Since the API supports sorting, we can add column header click handlers to sort the data:

```javascript
const handleSort = (column) => {
  const newSortOrder = column === sortBy && sortOrder === 'asc' ? 'desc' : 'asc';
  setSortBy(column);
  setSortOrder(newSortOrder);
  fetchProjects(currentPage, perPage, column, newSortOrder);
};
```

## 6. Update the Table Headers to Support Sorting

```jsx
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
```

## 7. Add the Pagination Controls to the UI

```jsx
{!loading && !error && projects.length > 0 && (
  <>
    <div className="table-responsive">
      {/* Existing table code */}
    </div>
    <PaginationControls />
  </>
)}
```

## 8. Handle Edge Cases

- Empty state (no projects)
- Error handling
- Loading state during page transitions

## 9. Optimize for Mobile Responsiveness

Ensure the pagination controls are responsive and work well on mobile devices.

## Component Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Projects Component
    participant API

    User->>Projects Component: Load component
    Projects Component->>API: fetchProjects(page, perPage, sortBy, sortOrder)
    API-->>Projects Component: Return paginated response
    Projects Component->>Projects Component: Update state with projects and pagination info
    Projects Component->>User: Display projects table with pagination controls
    
    User->>Projects Component: Click page number/next/previous
    Projects Component->>API: fetchProjects with new page
    API-->>Projects Component: Return new page data
    Projects Component->>User: Update display with new projects
    
    User->>Projects Component: Change items per page
    Projects Component->>API: fetchProjects with new perPage value
    API-->>Projects Component: Return adjusted data
    Projects Component->>User: Update display with new pagination
    
    User->>Projects Component: Click column header to sort
    Projects Component->>API: fetchProjects with new sort parameters
    API-->>Projects Component: Return sorted data
    Projects Component->>User: Update display with sorted projects