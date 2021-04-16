import { BroadcastOperator, Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
  GAME_CREATED,
  SELF_JOINED,
  USER_JOINED,
  USER_LEFT
} from "./events";

const DELAY_BEFORE_EXPIRATION = 30*60*5000 //thirty minutes

class Player {

  private _name : string;
  public get name() : string {
    return this._name;
  }

  private _id : string;
  public get id() : string {
    return this._id;
  }

  constructor(name: string, id: string) {
    this._name = name;
    this._id = id;
  }
}

class Room {
  private _players : Player[] = [];
  
  private _io: Server

  private _lastUpdatedTime: number = new Date().getTime()

  private markUpdated() {
    this._lastUpdatedTime = new Date().getTime()
  }

  public get isExpired() {
    const currentTime = new Date().getTime()
    return this._lastUpdatedTime < currentTime - DELAY_BEFORE_EXPIRATION
  }

  private get ioRoom() : BroadcastOperator<DefaultEventsMap> {
    return this._io.to(this.gamecode);
  }

  constructor(
    public gamecode: string,
    io: Server,
    socket: Socket
  ) {
    this._io = io
    socket.emit(GAME_CREATED, this.gamecode)
  }

  public addPlayer(username: string, userId: string, playerSocket: Socket) {
    playerSocket.join(this.gamecode)
    const player = new Player(username, userId)
    playerSocket.emit(SELF_JOINED, this._players)
    this._players.push(player)
    this.ioRoom.emit(USER_JOINED, player)

    //TODO: add event listeners to trigger class methods

    playerSocket.on('disconnect', () => {
      this._players = this._players.filter(p => p.id !== userId)
      this.ioRoom.emit(USER_LEFT, userId)
    })

    this.markUpdated()
  }
}

export default Room