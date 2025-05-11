# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

COPY .env .env

# Expose port
EXPOSE 5000

# Start the app
CMD ["node", "server.js"]
