FROM nginx:stable-alpine

# Copy the custom Nginx configuration for SPA routing
# This path is relative to the Docker build context (monorepo root)
COPY ./apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy the pre-built application artifacts from the Docker build context.
# The CI pipeline should have built the 'web' app and its output
# (e.g., dist/apps/web) will be part of the Docker build context.
COPY ./dist/apps/web /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Add health check for container orchestration platforms
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/ || exit 1

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
