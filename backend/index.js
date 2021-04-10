const util = require('./util');
const http = require("http");
const socketio = require("socket.io");

const static = require("node-static");

const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();

const file = new static.Server('./public')

const httpServer = http.createServer((req, res) => {
  file.serveFile('/index.html', 200, {}, req, res); //Serve a small html file to handle pings from Azure
});

const io = socketio(httpServer, {
  cors: {
    origin: process.env.PORT ? "https://sixtakesgame.netlify.app" : "http://localhost:8080", //Allow dev server
  },
});

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.sessionID = util.randomId();
  socket.userID = util.randomId();
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  console.log(`Client ${socket.handshake.auth.username} connected`)
  var gamecode = socket.handshake.query.gamecode
  if (!gamecode) {
    gamecode = util.createGamecode()
    socket.emit('game created', gamecode)
    console.log("Creating game " + gamecode)
  }
  else {
    //TODO: ensure there is a game with this name
    console.log("Joining game " + gamecode)
  }
  socket.join(gamecode)
  socket.to(gamecode).emit('user joined', {
    //TODO: debug why this event is not reaching the one who joined
    username: socket.handshake.auth.username,
    userId: socket.userID
  })
});

const PORT = process.env.PORT || 3000;

const host = process.env.PORT ? '0.0.0.0' : 'localhost';

httpServer.listen(PORT, host, () =>
  console.log(`server listening at http://${host}:${PORT}`)
);