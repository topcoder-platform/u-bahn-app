# Use the base image with Node.js 12
FROM node:12

# Copy the current directory into the Docker image
COPY . /ubahn_app

# Set working directory for future use
WORKDIR /ubahn_app

# Install the dependencies from package.json
RUN npm install
# RUN npm run install-client
RUN ["/bin/bash", "-c", "source buildenvvar ;npm run install-client"]
CMD npm start
