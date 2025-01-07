# Use the Node.js LTS image as the base
FROM node:lts AS build

# Set the working directory inside the container
WORKDIR /usr/src/frontend

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the environment file (if needed for the build process)
ARG ENV_FILE=.env
COPY $ENV_FILE .env

# Copy the rest of the frontend code to the container
COPY . .

RUN npm run build

FROM nginx:1.10

WORKDIR /usr/share/nginx/html

# RUN rm -rf *

COPY --from=build /usr/src/frontend/dist .

# Copy the custom Nginx configuration
COPY nginx.conf /home/ubuntu/actions-runner/_work/fullstack-frontend-group15/fullstack-frontend-group15/nginx_custom.conf

# Expose port 80 for the frontend
EXPOSE 80

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]

# CMD ["npm", "run", "dev"]

