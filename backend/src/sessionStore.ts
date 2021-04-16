class SessionContext {
  private _id : string
  public get id() : string {
    return this._id
  }

  private _userId : string
  public get userId() : string {
    return this._userId
  }

  private _username : string
  public get username() : string {
    return this._username
  }

  constructor(id: string, userId: string, username: string) {
    this._id = id
    this._userId = userId
    this._username = username
  }
}

class Session extends SessionContext {
  private _connected : boolean = false
  public get connected() : boolean {
    return this._connected
  }
  constructor(ctx: SessionContext) {
    super(ctx.id, ctx.userId, ctx.username);
    this._connected = false;
  }
}

interface SessionStore {
  findSession(id: string): Session
  addSession(session: Session): void
  findAllSessions(): Session[]
}

class InMemorySessionStore implements SessionStore {
  private sessions: Map<string, Session> = new Map()

  findSession(id: string) {
    return this.sessions.get(id)
  }

  addSession(session: Session) {
    this.sessions.set(session.id, session)
  }

  findAllSessions() {
    return [...this.sessions.values()]
  }
}

export {
  Session,
  SessionContext,
  SessionStore,
  InMemorySessionStore
};