<template>
  <ConnectScreen class="main" v-if="game == null" @submit="onSubmitUsername"/>
  <WaitingScreen class="main" v-else-if="!gameStarted" :game="game"/>
  <GameScreen class="main" v-else />
</template>

<script>
import ConnectScreen from './components/views/ConnectScreen.vue'
import WaitingScreen from './components/views/WaitingScreen.vue'
import GameScreen from './components/views/GameScreen.vue'

import createSupabaseClient from '@/supabase'
import SixTakesGame from '@/core'
import { ref, computed } from 'vue'

export default {
  name: 'App',
  components: {
    ConnectScreen,
    WaitingScreen,
    GameScreen
  },
  setup() {
    const game = ref(null) //Will be created when user connects

    const onSubmitUsername = ({username, gamecode}) => {
      game.value = new SixTakesGame(createSupabaseClient(), username, gamecode)
      //TODO: handle auth error?
    }

    const gameStarted = computed(() => game.value ? game.value.gameIsStarted : false)

    return {
      onSubmitUsername,
      game,
      gameStarted,
    }
  },
}
</script>

<style>
body {
  height: 100vh;
  margin: 0;
  background-color: #f0f0f0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 80%;
}
.main {
  height: 100%;
}
button {
  background-color: purple;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 10px;
}
button[disabled] {
  opacity: 0.6;
}
button:not([disabled]) {
  cursor: pointer;
}
input {
  min-height: 32px;
  font-size: 16px;
  border-radius: 4px;
  margin-right: 10px;
  border: 1px solid gray;
}
</style>
