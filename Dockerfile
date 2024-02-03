# Use an official Node runtime as a base image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to /app
COPY package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install app dependencies
RUN npm install

# Copy all files from the current directory to /app in the container
COPY . .

# Expose port 4200 for the Angular development server
EXPOSE 4202

# Command to start the Angular development server
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4202", "--disable-host-check"]