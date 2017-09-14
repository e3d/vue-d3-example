<template>
  <div class="chart" :style="_containerStyle">
    <svg style="width:100%;height:100%;" ref="svgRoot">
      <g v-if="_hasTitle" :transform="_titleTransform">
        <text class="chart-title">{{_options.title}}</text>
      </g>
      <g :transform="_chartTransform">
        <g class="chart-axis">
          <chart-axis :title="_options.axisY.title" orient="Left" :scale="_scaleY" />
          <g :transform="_axisTransform">
            <chart-axis :title="_options.axisX.title" orient="Bottom" :scale="_scaleX" />
          </g>
        </g>
        <g class="chart-contents" clip-path="url(#chart-content-clip)">
          <data-line v-for="line in lines" :key="line.id"
            :line="line" 
            :scaleX="_scaleX" 
            :scaleY="_scaleY" 
            :defined="_defined"
            :selectedLines="selectedLines"/>
          <ref-line v-for="line in refLines" :key="line.id" 
            :value="line.value" 
            :axis="line.axis" 
            :color="line.color"
            :scale="line.axis === 'X' ? _scaleX : _scaleY"
            :length="line.axis === 'X' ? contentHeight : contentWidth" />
        </g>
      </g>
      <defs>
        <clipPath id="chart-content-clip">
          <rect :width="contentWidth" :height="contentHeight"></rect>
        </clipPath>
      </defs>
    </svg>
    <glass-pane @select="onSelect" @scroll="onScroll" @drag="onDrag" :margin="margin" />
  </div>
</template>

<script>
import * as d3 from 'd3';
import _ from 'lodash';
import DataLine from './DataLine.vue';
import RefLine from './RefLine.vue';
import ChartAxis from './ChartAxis.vue';
import GlassPane from './GlassPane.vue';
import SVGUtil from '../utils/SVGUtil';
import IntersectionUtil from '../utils/IntersectionUtil';

const DEFAULT_OPTIONS = {
  axisX: {
    scale: 'Linear'
  },
  axisY: {
    scale: 'Linear'
  }
};

export default {
  props: {
    options: { // { title: 'My Chart', axisX: { title: 'X', scale: 'Linear' | 'Log' }, axisY: {...} }
      type: Object,
      default: () => ({})
    },
    width: {
      type: Number,
      default: 600
    },
    height: {
      type: Number,
      default: 400
    },
    lines: { // [{ id: 0, values: [...], color: 'green' }, ...]
      type: Array,
      required: true
    },
    refLines: { // [{ id: 'ref-0', value: 10, axis: 'X|Y', color: 'blue' }, ...]
      type: Array,
      required: false
    }
  },
  data: function() {
    return {
      prefDomainX: null,
      prefDomainY: null,
      selectedLines: []
    };
  },
  computed: {
    _options() {
      return _.merge({}, DEFAULT_OPTIONS, this.options);
    },
    _containerStyle() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    },
    _chartTransform() {
      return `translate(${this.margin.left}, ${this.margin.top})`;
    },
    _titleTransform() {
      return `translate(${this.width/2}, ${this.margin.top * 3/5})`;
    },
    _axisTransform() {
      return `translate(0, ${this.contentHeight})`;
    },
    _hasTitle() {
      const { title } = this._options;
      return title && title.length > 0;
    },
    _hasAxisTitleX() {
      const { title } = this._options.axisX;
      return title && title.length > 0;
    },
    _hasAxisTitleY() {
      const { title } = this._options.axisY;
      return title && title.length > 0;
    },
    margin() {
      return {
        top: 20 + (this._hasTitle ? 20 : 0),
        right: 20,
        bottom: 30 + (this._hasAxisTitleX ? 20 : 0),
        left: 40 + (this._hasAxisTitleY ? 20 : 0)
      }
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
      const { axisX } = this._options;
      const { rangeX, domainX } = this;
      return d3['scale' + axisX.scale]().range(rangeX).domain(domainX);
    },
    _scaleY() {
      const { axisY } = this._options;
      const { rangeY, domainY } = this;
      return d3['scale' + axisY.scale]().range(rangeY).domain(domainY);
    },
    _defined() {
      const { axisY } = this._options;
      if (axisY.scale === 'Log') {
        return d => d > 0.000001; // do not show too small values for Log
      }
    }
  },
  watch: {
    'axisY.scale'() {
      this.resetDomain(); // domain in linear scale may be invalid in log scale
    }
  },
  methods: {
    resetDomain() {
      this.prefDomainX = null;
      this.prefDomainY = null;
    },
    zoom(x, y, factor) {
      const { _scaleX, _scaleY, contentWidth, contentHeight } = this;
      const { defaultDomainX: [_x1, _x2], defaultDomainY: [_y1, _y2] } = this;
      const x1 = _scaleX.invert(x - x * factor);
      const x2 = _scaleX.invert(x + (contentWidth - x) * factor);
      const y1 = _scaleY.invert(y + (contentHeight - y) * factor);
      const y2 = _scaleY.invert(y - y * factor);
      this.prefDomainX = [Math.max(_x1, x1), Math.min(_x2, x2)];
      this.prefDomainY = [Math.max(_y1, y1), Math.min(_y2, y2)];
    },
    pan(deltaX, deltaY) {
      const { _scaleX, _scaleY, rangeX, rangeY } = this;
      const { defaultDomainX: [_x1, _x2], defaultDomainY: [_y1, _y2] } = this;
      let x1 = _scaleX.invert(rangeX[0] - deltaX);
      let x2 = _scaleX.invert(rangeX[1] - deltaX);
      let y1 = _scaleY.invert(rangeY[0] - deltaY);
      let y2 = _scaleY.invert(rangeY[1] - deltaY);
      if (_x1 < x1 && x2 < _x2) {
        this.prefDomainX = [x1, x2];
      }
      if (_y1 < y1 && y2 < _y2) {
        this.prefDomainY = [y1, y2];
      }
    },
    select(p1, p2) {
      const { _scaleX, _scaleY } = this;
      const x1 = _scaleX.invert(p1.x);
      const y1 = _scaleY.invert(p1.y);
      const x2 = _scaleX.invert(p2.x);
      const y2 = _scaleY.invert(p2.y);
      this.selectedLines = this.lines.filter(line => {
        return IntersectionUtil.polyLineIntersectsBox(
          line.values, {x: x1+1, y: y1}, {x: x2+1, y: y2});
      });
    },
    downloadSVG(fileName) {
      SVGUtil.downloadSVG(this.$refs.svgRoot, fileName);
    },
    downloadPNG(fileName, scale) {
      SVGUtil.downloadPNG(this.$refs.svgRoot, fileName, this.width, this.height, scale);
    },
    onSelect(p1, p2) {
      this.select(p1, p2);
    },
    onScroll(center, delta) {
      const factor = delta > 0 ? 1.1 : 0.9;
      this.zoom(center.x, center.y, factor);
    },
    onDrag(deltaX, deltaY) {
      this.pan(deltaX, deltaY);
    }
  },
  components: {
    'chart-axis': ChartAxis,
    'data-line': DataLine,
    'ref-line': RefLine,
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

.chart-title {
  text-anchor: middle;
  font-weight: bold;
}
</style>
