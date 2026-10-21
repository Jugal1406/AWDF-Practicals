# Practical 11: Containerization with Docker & Docker Compose
# Student: Jugal Kshatriya (24CS042)
# Node.js backend container definition

FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install application dependencies inside container
RUN npm install

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start Node.js Express server
CMD ["node", "server.js"]
