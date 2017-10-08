<template>
  <path fill="none" :stroke="line.color" :d="path" :stroke-width="_lineWidth"/>
</template>

<script>
import * as d3 from 'd3';

export default {
  props: {
    line: { // { values: [...], color: 'green' }
      type: Object,
      required: true
    },
    scaleY: { // D3 scale function, like d3.scaleLinear
      type: Function,
      required: true
    },
    scaleX: { // D3 scale function, like d3.scaleLinear
      type: Function,
      required: true
    },
    defined: { // any value less than it will be skipped, helpful if Y is Log scale
      type: Function,
      required: false
    },
    highlighted: { // if the line should be shown as highlighted
      type: Boolean,
      default: false
    }
  },
  computed: {
    path() {
      // Use D3 to generate SVG path
      const path = d3.line()
        .x((d, i) => this.scaleX(i))
        .y(d => this.scaleY(d));
      if (this.defined) {
        path.defined(this.defined); // filter values
      }
      return path(this.line.values);
    },
    _lineWidth() {
      return this.highlighted ? 2 : 1;
    }
  }
}
</script>

