import Room from './room'

interface RoomStore {
  findRoom(gamecode: string): Room
  addRoom(room: Room): void
  findAllRooms(): Room[]
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
}

export {
  RoomStore,
  InMemoryRoomStore
};