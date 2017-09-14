<template>
  <div class="glass-pane" :style="_styleObject" 
    @mouseup="_handleMouseUp" 
    @mousemove="_handleMouseMove" 
    @mousedown="_handleMouseDown" 
    @mouseleave="_handleMouseLeave" 
    @mousewheel.prevent="_handleMouseWheel">
    <selection-box v-if="selectMode" :p1="anchor" :p2="current" />
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
    }
  },
  components: {
    'selection-box': SelectionBox
  },
  data: function() {
    return {
      anchor: null,
      current: null,
      selectMode: true
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

      // select mode unless altert key pressed
      this.selectMode = !event.altKey && !event.shiftKey; 

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
      this.anchor = null;
      this.current = null;

      if (this.selectMode) {
        this.$emit('select', new Point(x1, y1), new Point(x2, y2), event.ctrlKey);
      } else {
        this.selectMode = true; // restore to select mode
      }
    },
    _handleMouseLeave(event) {
      this._handleMouseUp(event);
    },
    _handleMouseMove(event) {
      if (!this.anchor) {
        return;
      }
      event.stopPropagation();

      const { left, top } = this.$el.getBoundingClientRect();
      const prevCurrent = this.current || this.anchor;
      this.current = {
        x: event.clientX - left,
        y: event.clientY - top
      };

      if (!this.selectMode) {
        this.$emit('drag', this.current.x - prevCurrent.x, this.current.y - prevCurrent.y);
      }
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
