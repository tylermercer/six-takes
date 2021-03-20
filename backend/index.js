const static = require('node-static');
const util = require('./util');
const http = require("http");
const socketio = require("socket.io");

const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();

const file = { value: null };
const serveFiles = !!process.env.BUILD_DIR;
if (serveFiles) {
  file.value = new(static.Server)(__dirname + '/' + process.env.BUILD_DIR);
}

const httpServer = http.createServer(serveFiles ? function (req, res) {
  file.value.serve(req, res);
} : undefined);

const io = socketio(httpServer, {
  cors: {
    origin: "http://localhost:8080", //Allow dev server
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
    console.log("Joining game " + gamecode)
  }
  socket.join(gamecode)
  socket.to(gamecode).emit('user joined', {
    username: socket.handshake.auth.username,
    userId: socket.userID
  })
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);