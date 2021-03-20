<template>
  <div class="landing">
    <h1>Six Takes!</h1>
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
      <button :disabled="!canBeSubmitted" @click="submit">{{isCreateMode? "Create game" : "Join game"}}</button>
    </section>
  </div>
</template>
<script>
export default {
  data() {
    // get code from url, e.g. 'ACBD' from 'sixtakes.openode.io/ACBD'
    const gamecode = window.location.pathname
                      .substring(1)
                      .toUpperCase()
    return {
      mode: gamecode? 'join' : 'create',
      initGamecode: gamecode,
      gamecode,
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
    submit() {
      this.$emit('submit', { gamecode: this.gamecode, username: this.tmpUsername })
    }
  },
}
</script>

<style scoped>
.landing {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>