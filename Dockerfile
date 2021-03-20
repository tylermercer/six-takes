FROM node:14

# Create app directory
WORKDIR /opt/app

ENV PORT=80

# Install app dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy and build frontend
COPY ./frontend ./frontend
WORKDIR ./frontend
RUN npm install @vue/cli-service -g && npm install && npm run build
WORKDIR ..

# Bundle app source
COPY ./backend .

ENV BUILD_DIR=frontend/dist

# npm start, make sure to have a start attribute in "scripts" in package.json
RUN echo 'sleep 5' >> /buildfrontend.sh
CMD sh /buildfrontend.sh && npm start
