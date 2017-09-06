
<template>
  <div class="rubber-band" :style="styleObject" />
</template>

<script>
import Point from './Point';

export default {
  props: {
    p1: {
      type: Object,
      default: null
    },
    p2: {
      type: Object,
      default: null
    },
  },
  computed: {
    styleObject() {
      let { p1, p2 } = this;
      if (!p1 || !p2) {
        p1 = new Point(0, 0);
        p2 = new Point(0, 0);
      }

      const [x1, x2] = p1.x < p2.x ? [p1.x, p2.x] : [p2.x, p1.x];
      const [y1, y2] = p1.y < p2.y ? [p1.y, p2.y] : [p2.y, p1.y];
      const width = x2 - x1;
      const height = y2 - y1;
      const visibility = (width && height) ? 'inherit' : 'hidden';
      return {
        left: x1 + 'px',
        top: y1 + 'px',
        width: width + 'px',
        height: height + 'px',
        visibility
      }
    }
  }
}
</script>


<style>
.rubber-band {
  position: relative;
  border: 1px dashed black;
  background-color: lightblue;
  opacity: 0.5;
}
</style>
