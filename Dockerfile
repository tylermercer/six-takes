FROM node:14

# Create app directory
WORKDIR /opt/app

ENV PORT=80

# Install app dependencies
COPY backend/package*.json ./

# Bundle app source
COPY ./backend .

RUN echo 'crond' >> /boot.sh

RUN echo 'npm install --production' >> /boot.sh

# npm start, make sure to have a start attribute in "scripts" in package.json
RUN echo 'sleep 5' >> /boot.sh
CMD sh /boot.sh && npm start
