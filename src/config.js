/**
 * Application configuration
 */

// Determine if we should use absolute URLs or relative URLs (for proxy)
// In development, we use relative URLs to leverage the proxy in package.json
// In production, we use the configured API URL
const isProduction = process.env.NODE_ENV === 'production';
const API_BASE_URL = isProduction
  ? (process.env.REACT_APP_API_BASE_URL || '/api')
  : '';

// API endpoints
const API_ENDPOINTS = {
  projects: `${API_BASE_URL}/projects`,
};

const config = {
  API_BASE_URL,
  API_ENDPOINTS,
  isProduction,
};

export default config;