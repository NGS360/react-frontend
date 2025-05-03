# NGS360 React Frontend - Docker Deployment

This document provides instructions for building and running the NGS360 React Frontend application using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (optional, but recommended)

## Building and Running with Docker Compose (Recommended)

The easiest way to build and run the application is using Docker Compose:

```bash
# Build and start the container
docker compose up -d

# View logs
docker compose logs -f frontend

# Stop the container
docker compose down
```

The application will be available at http://localhost:3000

## Integration with API Server

This frontend can be integrated with the existing API server setup. To do this:

1. Copy the `frontend` service definition from `compose.yaml` into the API server's `compose.yaml` file
2. Copy the Dockerfile, nginx.conf, and other necessary files to the API server directory
3. Update the context path in the API server's compose.yaml if needed

Example integration:

```yaml
services:
  # Existing API services...
  
  frontend:
    build:
      context: ./react-frontend
      dockerfile: Dockerfile
    container_name: ngs360-frontend
    ports:
      - "3000:80"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 5
```

## Building and Running with Docker

If you prefer to use Docker commands directly:

```bash
# Build the Docker image
docker build -t ngs360/frontend:latest .

# Run the container
docker run -d -p 3000:80 --name ngs360-frontend ngs360/frontend:latest

# Stop the container
docker stop ngs360-frontend

# Remove the container
docker rm ngs360-frontend
```

The application will be available at http://localhost:3000

You can also push the image to a Docker registry:

```bash
# Tag the image for your registry
docker tag ngs360/frontend:latest your-registry.com/ngs360/frontend:latest

# Push to the registry
docker push your-registry.com/ngs360/frontend:latest
```

## Production Deployment Considerations

For production deployments, consider the following:

1. Use environment variables for configuration
2. Implement proper logging
3. Set up health checks
4. Configure proper SSL/TLS termination
5. Use a container orchestration platform like Kubernetes

## Docker Image Structure

The Docker image is built using a multi-stage approach:

1. **Build Stage**: Uses Node.js to build the React application
2. **Production Stage**: Uses Nginx to serve the static files efficiently

This approach results in a smaller final image that contains only what's necessary to run the application.