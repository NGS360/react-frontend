# API Configuration

The application uses a configurable API URL that can be set using environment variables.

## Development Mode

In development mode, the application uses the proxy feature of Create React App to avoid CORS issues. This is configured in `package.json` with:

```json
"proxy": "http://localhost:5000"
```

This means API requests will be automatically proxied to http://localhost:5000 during development, and you don't need to specify the full URL in your API calls.

## Production Mode

For production deployment, you need to configure the API URL:

1. Create a `.env` file in the root directory (you can copy from `.env.example`)
2. Set the `REACT_APP_API_BASE_URL` variable to your API server URL

Example:
```
REACT_APP_API_BASE_URL=https://api.example.com
```

If no environment variable is set, the application will default to `/api` as the API base URL in production.

## How It Works

The application uses a central configuration file (`src/config.js`) that:

1. Detects whether the app is running in development or production mode
2. In development: Uses relative URLs to leverage the proxy feature
3. In production: Uses the configured API base URL from environment variables

This approach allows you to:
- Develop locally without CORS issues
- Deploy to production with a configurable API URL
- Change the API URL without modifying the code