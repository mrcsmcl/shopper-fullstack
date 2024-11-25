# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build TypeScript
RUN npx tsc

# Expose port
EXPOSE 8080

# Command to start the application
CMD ["node", "dist/index.js"]
