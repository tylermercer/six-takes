<template>
  <div id="waiting-screen">
    <h2>Waiting for players to join</h2>
    <p>Game code: {{game.gamecode}}</p>
    <p><button @click="copyLink">{{copied? 'Copied!' : 'Copy link'}}</button></p>
    <ul>
      <li v-for="user in game.users" :key="user.userId">{{user.username}}</li>
    </ul>
  </div>

</template>

<script>
import { ref } from 'vue'
import SixTakesGame from '@/core'

export default {
  props: {
    game: {
      type: SixTakesGame,
      required: true
    },
  },
  setup(props) {
    const copied = ref(false);
    const copyLink = async () => {
      await navigator.clipboard.writeText(`https://sixtakesgame.openode.io/${props.game.gamecode}`)
      copied.value = true
    }
    return {
      copyLink,
      copied
    }
  },
}
</script>