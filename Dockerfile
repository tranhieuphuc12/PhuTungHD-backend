# Use Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

COPY .env .env

# Expose port
EXPOSE 3001

# Start the app
CMD ["npm", "start"]
