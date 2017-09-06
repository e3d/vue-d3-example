<template>
  <path fill="none" :stroke="data.color" :d="line" />
</template>

<script>
import * as d3 from 'd3';

export default {
  props: {
    'data': { // { values: [...], color: 'green' }
      type: Object,
      required: true
    },
    'scaleY': { // D3 scale function, like d3.scaleLinear
      type: Function,
      required: true
    },
    'scaleX': { // D3 scale function, like d3.scaleLinear
      type: Function,
      required: true
    }
  },
  computed: {
    line: function() {
      // Use D3 to generate SVG path
      const path = d3.line()
        .x((d, i) => this.scaleX(i))
        .y(d => this.scaleY(d));
      return path(this.data.values);
    }
  }
}
</script>

