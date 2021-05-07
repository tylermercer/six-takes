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
  constructor(client, username, gamecode = null) {
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
    this.client = client

    //TODO: sign up, create game, save game code

    //TODO: set up users subscription (insert, update)

    //TODO: set up active cards subscription (insert)

    //TODO: set up card subscription (insert, only user's cards)
  }
}

export default SixTakesGame