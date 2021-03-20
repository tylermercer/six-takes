<template>
  <div>Dealing cards...</div>
</template>

<script>
import BasicCard from '../BasicCard.vue'

export default {
  components: {
    BasicCard
  },
  props: {
    socket: {
      type: Object,
      required: true
    }
  },
  setup() {
    //TODO: register game logic in socket listeners
  },
}
</script>