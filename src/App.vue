<template>
  <div class="container">
    <h1>Vue D3 Line Chart Example</h1>
    <p class="lead">Use mouse wheel to zoom and alt/shift+drag for pan. 
      Drag box to select lines, optionally with Ctrl key. 
      Resize window to see chart responding.</p>
    <div class="row">
      <div v-resize-detector="onResize" class="col-7">
        <line-chart ref="lineChart" 
          :width="width"
          :height="height"
          :options="options" 
          :lines="lines"
          :refLines="refLines" />
      </div>
      <div class="col-5">
        <control-panel :options="options" 
          @changeTitle="title => options.title = title"
          @changeAxisTitleX="title => options.axisX.title = title"
          @changeAxisTitleY="title => options.axisY.title = title"
          @changeScale="onChangeScale" 
          @resetZoom="onResetZoom" 
          @saveImage="onSaveImage" />
      </div>
    </div>
  </div>
</template>

<script>
import ControlPanel from './components/ControlPanel.vue';
import LineChart from './components/LineChart.vue';
import ResizeDetector from './directives/ResizeDetector';

export default {
  data: function() {
    return {
      width: 600,
      height: 400,
      options: {
        title: 'Example Chart',
        axisX: {
          title: 'Axis X'
        },
        axisY: {
          title: 'Axis Y',
          scale: 'Linear' // need this to observe changes
        }
      },
      lines: [
        {
          id: 0,
          values: [1, 0.5, 18, 12, 34, 22, 60, 80, 110, 120],
          color: 'steelblue'
        },
        {
          id: 1,
          values: [7, 21, 58, 65, 86, 92, 80, 70, 65],
          color: 'blue'
        },
        {
          id: 2,
          values: [5, 41, 68, 55, 76, 32, 60, 90, 100],
          color: 'green'
        }
      ],
      refLines: [
        {
          id: 'Ref-Y',
          value: 60,
          axis: "Y",
          color: "brown"
        },
        {
          id: 'Ref-X',
          value: 5,
          axis: "X",
          color: "green"
        }
      ]
    }
  },
  methods: {
    onChangeScale(newScale) {
      this.options.axisY.scale = newScale;
    },
    onResetZoom() {
      this.$refs.lineChart.resetDomain();
    },
    onSaveImage(imageFormat, imageScale) {
      const fileName = 'Line Chart';
      if (imageFormat === 'svg') {
        this.$refs.lineChart.downloadSVG(fileName + '.svg');
      } else {
        this.$refs.lineChart.downloadPNG(fileName + '.png', imageScale);
      }
    },
    onResize(element) {
      var width = element.offsetWidth;
      var height = element.offsetHeight;
      this.width = width - 30;
      this.height = height;
    }
  },
  components: {
    'control-panel': ControlPanel,
    'line-chart': LineChart
  },
  directives: {
    'resize-detector': ResizeDetector
  }
}
</script>
