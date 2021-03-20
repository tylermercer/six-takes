<template>
  <ConnectScreen class="main" v-if="socket == null" @submit="onSubmit"/>
  <WaitingScreen class="main" v-else-if="!gameStarted"/>
</template>

<script>
import BasicCard from './components/BasicCard.vue'
import ConnectScreen from './components/views/ConnectScreen.vue'
import WaitingScreen from './components/views/WaitingScreen.vue'

import createSocket from '@/socket'

export default {
  name: 'App',
  components: {
    BasicCard,
    ConnectScreen,
    WaitingScreen
  },
  data() {
    return {
      socket: null, //Will be created when user connects
      usernameAlreadySelected: false,
      gameStarted: false,
    }
  },
  methods: {
    onSubmit({username, gamecode}) {
      this.socket = createSocket(gamecode)
      this.socket.on("connect_error", (err) => {
        if (err.message === "invalid username") {
          this.usernameAlreadySelected = false
        }
      });
      this.socket.onAny((name, ...args) => {
        console.log(`'${name}' occurred. Args:`, ...args)
      })
      this.usernameAlreadySelected = true
      this.socket.auth = { username }
      this.socket.connect()
    }
  },
  beforeUnmount() {
    if (this.socket) this.socket.off("connect_error")
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
#code-input {
  width: 40px;
  text-align: center;
  width: 54px;
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
input {
  min-height: 32px;
  font-size: 16px;
  border-radius: 4px;
  margin-right: 10px;
  border: 1px solid gray;
}
input.mode {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
  max-height: 0;
  max-width: 0;
  z-index: -1;
  overflow: hidden;
}
#mode-select {
  margin-top: 10px;
  height: 60px;
  display: flex;
  align-items: center;
}
input.mode + label {
  background-color: white;
  display: block;
  border-radius: 4px;
  margin: 10px;
  padding: 4px;
  border: 2px solid purple;
  opacity: 0.6;
  transform: scale(1);
  transition: transform ease 0.2s;
}
input.mode:checked + label {
  opacity: 1;
  transform: scale(1.2);
}
</style>
