<template>
  <div class="tooltip-box" :style="tooltipStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    }
  },
  computed: {
    tooltipStyle() {
      return {
        top: `${this.y + 10}px`,
        left: `${this.x + 10}px`
      }
    }
  }
}
</script>

<style scoped>
.tooltip-box { /* not named tooltip to avoid conflict with global*/
    position: absolute;
    border: 1px solid lightgrey;
    border-radius: 3px;
    padding: 5px 10px;
    background: white;
    z-index: 10000;
}
</style>
