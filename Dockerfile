FROM node:14

# Create app directory
WORKDIR /opt/app

# Install app dependencies
COPY backend/package*.json ./

RUN npm install --production

# Bundle app source
COPY ./backend .

ENV PORT=80

EXPOSE 80

CMD npm start
