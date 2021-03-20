const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:8080", //Allow dev server
  },
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  const gamecode = socket.handshake.query.gamecode.toUpperCase()
  console.log(gamecode);
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);