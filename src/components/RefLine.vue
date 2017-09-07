<template>
  <g>
    <text class="ref-line-label" :x="x1 + 5" :y="y1 - 3" :fill="color" >{{value}}</text>
    <line :x1="x1" :y1="y1" :x2="x2" :y2="y2" :stroke="color" stroke-dasharray="5,5" />
  </g>
</template>

<script>
import * as d3 from 'd3';

export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    length: {
      type: Number,
      required: true
    },
    axis: { // 'X', 'Y'
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'green'
    },
    scale: { // D3 scale function, like d3.scaleLinear
      type: Function,
      required: true
    }
  },
  computed: {
    x1() {
      const { value, axis, scale } = this;
      return axis === 'X' ? scale(value) : 0;
    },
    y1() {
      const { value, axis, scale, length } = this;
      return axis === 'X' ? length : scale(value);
    },
    x2() {
      const { value, axis, scale, length } = this;
      return axis === 'X' ? scale(value) : length;
    },
    y2() {
      const { value, axis, scale } = this;
      return axis === 'X' ? 0 : scale(value);
    }
  }
}
</script>

<style>
.ref-line-label {
  font-size: small;
}
</style>
