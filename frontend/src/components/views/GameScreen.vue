<template>
  <div>Dealing cards...</div>
</template>

<script>
import BasicCard from '../BasicCard.vue'
import SixTakesGame from '@/core'

export default {
  components: {
    BasicCard
  },
  props: {
    game: {
      type: SixTakesGame,
      required: true
    }
  },
  setup() {
    //TODO: register game logic in socket listeners
  },
}
</script>