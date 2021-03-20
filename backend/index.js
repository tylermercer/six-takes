var static = require('node-static');

var file;
var serveFiles = !!process.env.BUILD_DIR;
if (serveFiles) {
  file = new(static.Server)(__dirname + process.env.BUILD_DIR);
}

const httpServer = require("http").createServer(serveFiles ? function (req, res) {
  file.serve(req, res);
} : undefined);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:8080", //Allow dev server
  },
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  const gamecode = socket.handshake.query.gamecode;
  if (gamecode) {
    //TODO: use gamecode.toUpperCase() to look up the existing game
  }
});