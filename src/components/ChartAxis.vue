<template>
  <g>
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
    }
  },
  mounted: function() {
    // Draw the axis for the first time
    this._draw();
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
      d3.select(this.$el).call(d3['axis' + this.orient](this.scale));
    }
  }
}
</script>
