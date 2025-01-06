# Use the Node.js LTS image as the base
FROM node:lts

# Set the working directory inside the container
WORKDIR /usr/src/frontend

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code to the container
COPY . .

# Ensure the startup script is executable
RUN chmod +x ./startup.sh

# Expose port 5173 for the frontend
EXPOSE 5173

# Default command to run the frontend
CMD ["sh", "-c", "./startup.sh"]