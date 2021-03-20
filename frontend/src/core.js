import { ref } from 'vue'

export const pointsFromNumber = (num) => {
  if (num === 55) {
    return 7
  }
  if (num % 11 === 0) {
    return 5
  }
  if (num % 10 === 0) {
    return 3
  }
  if (num % 5 === 0) {
    return 2
  }
  else return 1
}

class SixTakesGame {
  constructor(socket, username, gamecode = null) {
    this.users = ref([])
    this.gamecode = ref('')
    this.isStarted = ref(false)
    const setGamecode = (newGamecode) => {
      const gc = newGamecode.toUpperCase()
      this.gamecode.value = gc
      history.pushState({}, '6 Takes! ' + gc, '/' + gc)
    }
    if (gamecode) {
      setGamecode(gamecode)
    }
    this.userIsHost = ref(gamecode? false : true)
    this.username = ref('')
    this.userId = ref('')
    this.socket = socket

    socket.on('users', (users) => {
      if (!this.isStarted.value)
        this.users.value = users.map(u => {
          return {
            username: u.username,
            userId: u.userId,
            isSelf: u.userId === socket.id
          }
        })
    })

    socket.on('user joined', (user) => {
      if (!this.isStarted.value) {
        if (this.users.value.find(u => u.userId === user.userId) == null)
          this.users.value = [...this.users.value, {
            username: user.username,
            userId: user.userId,
            isSelf: user.userId === socket.id
          }]
      }
    })

    socket.on('game created', (newGamecode) => {
      setGamecode(newGamecode)
    })

    socket.onAny((name, ...args) => {
      console.log(`'${name}' occurred. Args:`, ...args)
    })
    socket.auth = { username }
    socket.connect()
  }
}

export default SixTakesGame