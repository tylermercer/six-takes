import Room from './room'

interface RoomStore {
  findRoom(gamecode: string): Room
  addRoom(room: Room): void
  findAllRooms(): Room[]
  cullExpiredRooms(): void
}

class InMemoryRoomStore implements RoomStore {
  private rooms: Map<string, Room> = new Map()

  findRoom(gamecode: string) {
    return this.rooms.get(gamecode)
  }

  addRoom(room: Room) {
    this.rooms.set(room.gamecode, room)
  }

  findAllRooms() {
    return [...this.rooms.values()]
  }

  cullExpiredRooms() {
    this.rooms.forEach((room, gamecode, rooms) => {
      if (room.isExpired) rooms.delete(gamecode)
    })
  }
}

export {
  RoomStore,
  InMemoryRoomStore
};