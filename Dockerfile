# Use the Node.js LTS image as the base
FROM node:lts

# Set the working directory inside the container
WORKDIR /usr/src/frontend

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the frontend code to the container
COPY . .

# Expose port 5173 for the frontend
EXPOSE 5173


CMD ["npm", "run", "dev"]