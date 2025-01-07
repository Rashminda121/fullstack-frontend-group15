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

RUN npm run build

FROM nginx:1.10

WORKDIR /usr/share/nginx/html

RUN rm -rf *

COPY --from=build /usr/src/frontend/dist .

# Expose port 80 for the frontend
EXPOSE 80

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]

CMD ["npm", "run", "dev"]

