<template>
  <div class="chart" :style="_containerStyle">
    <svg style="width:100%;height:100%;" ref="svgRoot">
      <g :transform="_chartTransform">
        <g class="axis">
          <chart-axis orient="Left" :scale="_scaleY" />
          <g :transform="_axisTransform">
            <chart-axis orient="Bottom" :scale="_scaleX" />
          </g>
        </g>
        <g class="lines" clip-path="url(#line-clip)">
          <data-line v-for="line in lines" :key="line.id" :data="line" :scaleX="_scaleX" :scaleY="_scaleY" />
        </g>
      </g>
      <defs>
        <clipPath id="line-clip">
          <rect :width="contentWidth" :height="contentHeight"></rect>
        </clipPath>
      </defs>
    </svg>
    <glass-pane @select="onSelect" @scroll="onScroll" @drag="onDrag" :margin="margin" />
  </div>
</template>

<script>
import * as d3 from 'd3';
import DataLine from './DataLine.vue';
import ChartAxis from './ChartAxis.vue';
import GlassPane from './GlassPane.vue';
import svgToImage from '../vendor/svgToImage';

export default {
  props: {
    'width': {
      type: Number,
      default: 600
    },
    'height': {
      type: Number,
      default: 400
    },
    'scaleX': { // 'Linear', 'Log'
      type: String,
      default: 'Linear'
    },
    'scaleY': { // 'Linear', 'Log'
      type: String,
      default: 'Linear'
    },
    'lines': { // [{ values: [...], color: 'green' }, ...]
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      'margin': {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30
      },
      prefDomainX: null,
      prefDomainY: null
    };
  },
  computed: {
    _containerStyle() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    },
    _chartTransform() {
      return `translate(${this.margin.left}, ${this.margin.top})`;
    },
    _axisTransform() {
      return `translate(0, ${this.contentHeight})`;
    },
    defaultDomainX() {
      const max = d3.max(this.lines, line => line.values.length);
      return [0, max - 1]; // always start from 0
    },
    defaultDomainY() {
      const seed = this.lines[0].values[0];
      const range = this.lines.reduce((prevRange, line) => {
        const extent = d3.extent(line.values);
        return [Math.min(prevRange[0], extent[0]), Math.max(prevRange[1], extent[1])]
      }, [seed, seed]);
      return range;
    },
    domainX() {
      return this.prefDomainX ? this.prefDomainX : this.defaultDomainX;
    },
    domainY() {
      return this.prefDomainY ? this.prefDomainY : this.defaultDomainY;
    },
    rangeX() {
      return [0, this.contentWidth];
    },
    rangeY() {
      return [this.contentHeight, 0]; // range is upside down
    },
    contentWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    contentHeight() {
      return this.height - this.margin.top - this.margin.bottom;
    },
    _scaleX() {
      const { scaleX, rangeX, domainX } = this;
      return d3['scale' + scaleX]().range(rangeX).domain(domainX);
    },
    _scaleY() {
      const { scaleY, rangeY, domainY } = this;
      return d3['scale' + scaleY]().range(rangeY).domain(domainY);
    }
  },
  watch: {
    scaleY() {
      this.resetDomain(); // domain in linear scale may be invalid in log scale
    }
  },
  methods: {
    resetDomain() {
      this.prefDomainX = null;
      this.prefDomainY = null;
    },
    zoom(x, y, factor) {
      const x1 = this._scaleX.invert(x - x * factor);
      const x2 = this._scaleX.invert(x + (this.contentWidth - x) * factor);
      const y1 = this._scaleY.invert(y + (this.contentHeight - y) * factor);
      const y2 = this._scaleY.invert(y - y * factor);
      this.prefDomainX = [x1, x2];
      this.prefDomainY = [y1, y2];
    },
    pan(deltaX, deltaY) {
      const x1 = this._scaleX.invert(this.rangeX[0] - deltaX);
      const x2 = this._scaleX.invert(this.rangeX[1] - deltaX);
      const y1 = this._scaleY.invert(this.rangeY[0] - deltaY);
      const y2 = this._scaleY.invert(this.rangeY[1] - deltaY);
      this.prefDomainX = [x1, x2];
      this.prefDomainY = [y1, y2];
    },
    saveToImage(factor, callback) {
      factor = factor || 1;
      svgToImage(this.$refs.svgRoot, this.width * factor, this.height * factor, 'png', callback);
    },
    onSelect(p1, p2) { // handler for selection pane
    },
    onScroll(center, delta) {
      const factor = delta > 0 ? 1.1 : 0.9;
      this.zoom(center.x, center.y, factor);
    },
    onDrag(delta) {
      this.pan(delta.x, delta.y);
    }
  },
  components: {
    'chart-axis': ChartAxis,
    'data-line': DataLine,
    'glass-pane': GlassPane
  },
  mounted() {
    this.resetDomain();
  }
}
</script>

<style>
.chart {
  position: relative;
  border: 1px solid lightgrey;
  user-select: none;
}
</style>
