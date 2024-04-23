# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json) to Docker environment
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside Docker image
COPY . .
RUN npm run build
# Make port 3000 available to the world outside this container
EXPOSE 6000

# Run the app using npm start
CMD ["npm", "start"]
