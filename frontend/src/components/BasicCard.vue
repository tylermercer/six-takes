<template>
  <span :class="classes">
    {{num}}
    <span class="points">
      {{'•'.repeat(points)}}
    </span>
  </span>
</template>

<script>
import { defineComponent } from 'vue'
import { pointsFromNumber } from '@/core.js'

export default defineComponent({
  props: {
    num: {
      type: Number,
      required: true
    }
  },
  computed: {
    points() {
      return pointsFromNumber(this.num)
    },
    classes() {
      if (this.points === 7) {
        return 'card seven'
      }
      if (this.points === 5) {
        return 'card five'
      }
      if (this.points === 3) {
        return 'card three'
      }
      if (this.points === 2) {
        return 'card two'
      }
      return 'card'
    }
  }
})
</script>

<style scoped>
.card {
  color: purple;
  border: 2px solid purple;
  padding: 10px;
  font-size: 20px;
  border-radius: 6px;
  font-weight: bold;
  background-color: white;
  width: 26px;
  line-height: 44px;
  height: 34px;
  margin: 4px;
  position: relative;
  text-align: center;
}
.points {
  font-size: 12px;
  letter-spacing: 1.5px;
  display: block;
  position: absolute;
  top: -10px;
  left: 1px;
  width: 100%;
}
.card.seven {
  color: goldenrod;
  border-color: goldenrod;
}
.card.five {
  color: crimson;
  border-color: crimson;
}
.card.three {
  color: forestgreen;
  border-color: forestgreen;
}
.card.two {
  color: #0059ce;
  border-color: #0059ce;
}
</style>