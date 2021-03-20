FROM node:14

# Create app directory
WORKDIR /opt/app

ENV PORT=80

# Install app dependencies
COPY backend/package*.json ./

# Bundle app source
COPY ./backend .

COPY ./frontend ./frontend

RUN echo 'npm install --production' >> /boot.sh
RUN echo 'cd ./frontend' >> /boot.sh
RUN echo 'npm install --production' >> /boot.sh
RUN echo 'npm run build' >> /boot.sh
RUN echo 'cd ..' >> /boot.sh

ENV BUILD_DIR=frontend/dist

# npm start, make sure to have a start attribute in "scripts" in package.json
RUN echo 'sleep 5' >> /boot.sh
CMD sh /boot.sh && npm start
