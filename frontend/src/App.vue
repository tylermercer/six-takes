<template>
  <div class="centered">
    <BasicCard :num="11"/>
    <BasicCard :num="55"/>
    <BasicCard :num="9"/>
    <BasicCard :num="25"/>
    <BasicCard :num="40"/>
    <BasicCard :num="7"/>
    <BasicCard :num="14"/>
  </div>
</template>

<script>
import BasicCard from './components/BasicCard.vue'

import socket from '@/socket'

export default {
  name: 'App',
  components: {
    BasicCard
  },
  data() {
    return {
      usernameAlreadySelected: false
    }
  },
  created() {
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        this.usernameAlreadySelected = false
      }
    });
  },
  methods: {
    onUsernameSelection(username) {
      this.usernameAlreadySelected = true
      const gamecode = window.location.pathname.substring(1) // e.g. get 'ACBD' from 'sixtakes.openode.io/ACBD'
      socket.auth = { username, gamecode }
      socket.connect()
    }
  },
  unmounted() {
    socket.off("connect_error");
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
  height: 100%;
}
.centered {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
</style>
