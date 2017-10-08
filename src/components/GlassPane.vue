<template>
  <div class="glass-pane" 
    @mouseup="_handleMouseUp" 
    @mousemove="_handleMouseMove" 
    @mousedown="_handleMouseDown" 
    @mouseleave="_handleMouseLeave" 
    @mousewheel.prevent="_handleMouseWheel">
    <selection-box v-if="selectMode" :p1="anchor" :p2="current" />
    <slot></slot>
  </div>
</template>

<script>
import SelectionBox from './SelectionBox.vue';
import Point from './Point';

export default {
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
      const { left, top } = this.$el.getBoundingClientRect();
      this.$emit('move', event.clientX - left, event.clientY - top);
      
      if (!this.anchor) {
        return;
      }
      event.stopPropagation();

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
