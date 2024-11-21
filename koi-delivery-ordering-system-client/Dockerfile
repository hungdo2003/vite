# Build stage
FROM node:22 AS build

WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Clean npm cache and install dependencies
RUN npm cache clean --force
RUN npm install

# Copy the rest of the application code
COPY . .

# Force rebuilding on every Docker build by invalidating cache
RUN rm -rf node_modules/.cache

# Build the application using Vite
RUN npm run build

# Expose the port used by Vite (adjust based on your config)
EXPOSE 5173

# Start the Vite dev server (or use npm run start for production)
CMD ["npm", "run", "dev"]
