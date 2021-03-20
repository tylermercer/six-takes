<template>
  <div class="landing">
    <template v-if="!usernameAlreadySelected">
      <h1>Six Takes!</h1>
      <section>
      <BasicCard :num="11"/>
      <BasicCard :num="55"/>
      <BasicCard :num="9"/>
      <BasicCard :num="25"/>
      <BasicCard :num="40"/>
      <BasicCard :num="7"/>
      <BasicCard :num="14"/>
      </section>
      <section id="mode-select">
        <input class="mode" type="radio" id="create" value="create" v-model="mode">
        <label for="create">
          Create Game
        </label>
        <input class="mode" type="radio" id="join" value="join" v-model="mode">
        <label for="join">
          Join Game
        </label>
      </section>
      <section>
        <p>
          Please enter a username
          <span v-if="!isCreateMode">
            <span v-if="initGamecode">{{" "}}to join room {{gamecode}}</span>
            <span v-else>{{" "}}and four-letter room code to join</span>
          </span>
          <span v-else>{{" "}}to create a game</span>
        </p>
      </section>
      <section id="username-input">
        <input v-model="tmpUsername" autofocus/>
        <input id="code-input" v-if="!isCreateMode" @input="initGamecode = ''" v-model="gamecode"/>
        <button :disabled="!canBeSubmitted" @click="() => onUsernameSelection(tmpUsername)">{{isCreateMode? "Create game" : "Join game"}}</button>
      </section>
    </template>
  </div>
</template>

<script>
import BasicCard from './components/BasicCard.vue'

import createSocket from '@/socket'

export default {
  name: 'App',
  components: {
    BasicCard
  },
  data() {
    // get code from url, e.g. 'ACBD' from 'sixtakes.openode.io/ACBD'
    const gamecode = window.location.pathname
                      .substring(1)
                      .toUpperCase()
    return {
      mode: gamecode? 'join' : 'create',
      socket: null, //Will be created when user connects
      initGamecode: gamecode,
      gamecode,
      usernameAlreadySelected: false,
      tmpUsername: '',
    }
  },
  computed: {
    isCreateMode() {
      return this.mode === 'create'
    },
    canBeSubmitted() {
      return !!((this.isCreateMode || this.gamecode.length == 4) && this.tmpUsername.length > 0)
    }
  },
  methods: {
    onUsernameSelection(username) {
      this.socket = createSocket(this.gamecode)
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
  height: 100%;
}
#code-input {
  width: 40px;
  text-align: center;
  width: 54px;
}
.landing {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80%;
  width: 100%;
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
