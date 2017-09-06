<template>
  <div class="glass-pane" :style="_styleObject" @mouseup="_handleMouseUp" @mousemove="_handleMouseMove" @mousedown="_handleMouseDown" @mousewheel="_handleMouseWheel">
    <selection-box v-if="showSelectionBox" :p1="anchor" :p2="current" />
  </div>
</template>

<script>
import SelectionBox from './SelectionBox.vue';
import Point from './Point';

export default {
  props: {
    margin: {
      type: Object,
      required: true
    },
    showSelectionBox: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'selection-box': SelectionBox
  },
  data: function() {
    return {
      anchor: null,
      current: null
    }
  },
  computed: {
    _margin() { // computed margin (an object)
      const { margin } = this;
      if (Number.isInteger(margin)) {
        return {
          top: margin,
          left: margin,
          right: margin,
          bottom: margin
        };
      } else {
        return { // a copy
          top: margin.top,
          left: margin.left,
          right: margin.right,
          bottom: margin.bottom
        };
      }
    },
    _styleObject() {
      const { _margin } = this;
      return {
        top: `${_margin.top}px`,
        left: `${_margin.left}px`,
        right: `${_margin.right}px`,
        bottom: `${_margin.bottom}px`
      };
    }
  },
  methods: {
    _handleMouseDown(event) {
      if (event.button != 0) {
        return;
      }
      event.stopPropagation();
      const { left, top } = this.$el.getBoundingClientRect();
      this.anchor = {
        x: event.clientX - left,
        y: event.clientY - top
      };
    },
    _handleMouseUp(event) {
      if (!this.anchor) {
        return;
      }
      event.stopPropagation();
      const { anchor, current } = this;
      const end = current ? current : anchor;
      const [x1, x2] = anchor.x < end.x ? [anchor.x, end.x] : [end.x, anchor.x];
      const [y1, y2] = anchor.y < end.y ? [anchor.y, end.y] : [end.y, anchor.y];
      const { ctrlKey } = event;
      this.$emit('select', new Point(x1, y1), new Point(x2, y2), ctrlKey);
      this.anchor = null;
      this.current = null;
    },
    _handleMouseMove(event) {
      event.stopPropagation();
      if (!this.anchor) {
        return;
      }
      const { left, top } = this.$el.getBoundingClientRect();
      const prevCurrent = this.current || this.anchor;
      this.current = {
        x: event.clientX - left,
        y: event.clientY - top
      };
      this.$emit('drag', new Point(this.current.x - prevCurrent.x, this.current.y - prevCurrent.y));
    },
    _handleMouseWheel(event) {
      event.stopPropagation();
      const { left, top } = this.$el.getBoundingClientRect();
      this.$emit('scroll', new Point(event.clientX - left, event.clientY - top), event.deltaY);
    }
  }
}
</script>

<style>
.glass-pane {
  position: absolute;
  /*cover the underlying element*/
  background-color: transparent;
  /*show the underlying element*/
  user-select: none;
  /*prevent drag event*/
}
</style>
