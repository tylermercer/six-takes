import http from "http"
import socketIO from "socket.io"
import { SessionStore, InMemorySessionStore, SessionContext } from './sessionStore'
import { createGamecode, randomId } from './util'

class App {
    private server: http.Server
    private io: socketIO.Server
    private sessionStore: SessionStore

    constructor(private port: number, private host: string) {
        this.server = new http.Server()
        this.io = new socketIO.Server(this.server, {
          cors: {
            origin: process.env.PORT ? "https://sixtakesgame.netlify.app" : "http://localhost:8080",
          }
        })

        this.sessionStore = new InMemorySessionStore()

        this.io.use((socket, next) => {
          const sessionId = socket.handshake.auth.sessionID;
          if (sessionId) {
            const session = this.sessionStore.findSession(sessionId);
            if (session) {
              socket.data = new SessionContext(
                sessionId,
                session.userId,
                session.username
              )
              return next();
            }
          }
          const username = socket.handshake.auth.username;
          if (!username) {
            return next(new Error("invalid username"));
          }
          socket.data = new SessionContext(
            randomId(),
            randomId(),
            username
          )
          next();
        });
      }

      public start() {
        this.io.on("connection", (socket) => {
          const context = socket.data as SessionContext;
          console.log(`Client ${socket.handshake.auth.username} connected`)
          var gamecode = socket.handshake.query.gamecode
          if (!gamecode) {
            gamecode = createGamecode()
            socket.emit('game created', gamecode)
            console.log("Creating game " + gamecode)
          }
          else {
            //TODO: ensure there is a game with this name
            console.log("Joining game " + gamecode)
          }
          socket.join(gamecode)
          socket.to(gamecode).emit('user joined', {
            username: socket.handshake.auth.username,
            userId: context.userId
          })
        });

        this.server.listen(this.port, this.host, () => {
            console.log( `Server listening at ${this.host}:${this.port}.` )
        })
    }
}

const port = +process.env.PORT || 3000
const host = process.env.PORT ? '0.0.0.0' : 'localhost'

new App(port, host).start()