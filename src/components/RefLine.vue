<template>
  <g>
    <text class="ref-line-label" :x="x1 + 5" :y="y1 - 3" :fill="color" >{{value}}</text>
    <line :x1="x1" :y1="y1" :x2="x2" :y2="y2" :style="lineStyle"/>
  </g>
</template>

<script>
import * as d3 from 'd3';

export default {
  props: {
    line: { // { id: 'Ref-X', value: 5, axis: 'X' }
      type: Object,
      required: true
    },
    length: {
      type: Number,
      required: true
    },
    scale: { // D3 scale function, like d3.scaleLinear
      type: Function,
      required: true
    }
  },
  computed: {
    x1() {
      const { line: { value, axis } , scale } = this;
      return axis === 'X' ? scale(value) : 0;
    },
    y1() {
      const { line: { value, axis }, scale, length } = this;
      return axis === 'X' ? length : scale(value);
    },
    x2() {
      const { line: { value, axis }, scale, length } = this;
      return axis === 'X' ? scale(value) : length;
    },
    y2() {
      const { line: { value, axis }, scale } = this;
      return axis === 'X' ? 0 : scale(value);
    },
    lineStyle() {
      const { color, axis } = this.line;
      return {
        stroke: color,
        strokeDasharray: '5,5'
      }
    }
  }
}
</script>

<style>
.ref-line-label {
  font-size: small;
}
</style>
