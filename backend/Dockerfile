# Backend Dockerfile
FROM node:16-alpine

WORKDIR /app/backend

# Copy package.json and package-lock.json
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY backend/ .

EXPOSE 3002

CMD ["npm", "start"]