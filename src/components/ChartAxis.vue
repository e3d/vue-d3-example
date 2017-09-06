<template>
  <g>
      <g ref="axis"></g>
      <text class="axis-title" v-if="_hasTitle" :transform="_titleTransform">{{title}}</text>
  </g>
</template>

<script>
import * as d3 from 'd3';

export default {
  props: {
    'orient': { // Left, Right, Top, Bottom
      type: String,
      required: true
    },
    'scale': { // D3 scale function, like d3.scaleLinear
      type: Function,
      required: true
    },
    'title': {
      type: String,
      required: false
    }
  },
  computed: {
    _hasTitle() {
      return this.title && this.title.length > 0;
    },
    _titleTransform() {
      const [min, max] = this.scale.range();
      const mid = (max - min) / 2;
      switch (this.orient) {
        case 'Bottom':
          return `translate(${mid}, 35)`;
        case 'Left':
          return `translate(-40, ${-mid}) rotate(-90)`;
        default:
          return `translate(0, 0)`;
      }
    }
  },
  watch: {
    // Draw the axis whenever its scale changes
    scale(newDomain) {
      this._draw();
    }
  },
  methods: {
    _draw() {
      // Use D3 to draw the axis to the 'g' node
      // console.log(`*** Drawing ${this.orient} axis: range ${this.scale.range()}, domain ${this.scale.domain()}`);
      d3.select(this.$refs.axis).call(d3['axis' + this.orient](this.scale));
    }
  },
  mounted: function() {
    // Draw the axis for the first time
    this._draw();
  }
}
</script>

<style>
.axis-title {
    text-anchor: middle;
    font-size: small;
}
</style>

