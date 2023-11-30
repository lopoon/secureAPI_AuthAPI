# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build TypeScript code
RUN npm run build

RUN npm rebuild bcrypt --build-from-source

# Expose a port (optional) if your Node.js application listens on a specific port
EXPOSE 3000

# Define the command to run your compiled JavaScript script
CMD ["npm", "start"]