import http from "http"
import socketIO from "socket.io"
import {
  RoomStore,
  InMemoryRoomStore
} from "./roomStore"
import Room from "./room"
import {
  SessionStore,
  InMemorySessionStore,
  SessionContext,
  Session
} from './sessionStore'
import {
  createGamecode,
  randomId
} from './util'
import { ATTEMPTED_TO_JOIN_EXPIRED } from "./events"

class App {
    private server: http.Server
    private io: socketIO.Server
    private sessionStore: SessionStore
    private roomStore: RoomStore

    constructor(private port: number, private host: string) {
        this.server = new http.Server((req, res) => {
          //Respond to GET requests with a tiny HTML document so Azure can ping our app and see that it's alive
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write('<!DOCTYPE html><html><body>OK</body></html>');
          res.end();
        })

        this.io = new socketIO.Server(this.server, {
          cors: {
            origin: process.env.PORT ? "https://sixtakesgame.netlify.app" : "http://localhost:8080",
          }
        })

        this.sessionStore = new InMemorySessionStore()
        this.roomStore = new InMemoryRoomStore()

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
          const context = new SessionContext(
            randomId(),
            randomId(),
            username
          )
          this.sessionStore.addSession(new Session(context))
          socket.data = context
          next();
        });
      }

      public start() {
        this.io.on("connection", (socket) => {
          this.roomStore.cullExpiredRooms()

          const context = socket.data as SessionContext
          const username = socket.handshake.auth.username
          console.log(`Client ${username} connected`)

          var gamecode = socket.handshake.query.gamecode
          if (gamecode instanceof Array) {
            console.error("Bad connect request!")
            return
          }
          let room: Room
          if (!gamecode) {
            gamecode = createGamecode()
            console.log(`${username}: creating game ${gamecode}`)
            room = new Room(gamecode, this.io, socket)
            this.roomStore.addRoom(room)
          }
          else {
            room = this.roomStore.findRoom(gamecode)
            if (room == null) {
              console.log(`${username} attempted to join expired game ${gamecode}`)
              socket.emit(ATTEMPTED_TO_JOIN_EXPIRED, gamecode)
              return;
            }
          }
          console.log(`${username}: joining game ${gamecode}`)
          room.addPlayer(
            socket.handshake.auth.username,
            context.userId,
            socket
          )
        });

        this.server.listen(this.port, this.host, () => {
            console.log( `Server listening at ${this.host}:${this.port}.` )
        })
    }
}

const port = +process.env.PORT || 3000
const host = process.env.PORT ? '0.0.0.0' : 'localhost'

new App(port, host).start()