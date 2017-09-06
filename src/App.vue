<template>
  <div class="container">
    <h1>Vue D3 Line Chart Example</h1>
    <p class="lead">Use mouse wheel to zoom and drag for pan.</p>
    <div class="row">
      <div class="col-8">
        <line-chart ref="lineChart" :lines="lines" :scaleY="chartConfig.scaleY" />
      </div>
      <div class="col-4">
        <control-panel :initConfig="chartConfig" @changeScale="onChangeScale" @resetZoom="onResetZoom" @saveImage="onSaveImage" />
      </div>
    </div>
  </div>
</template>

<script>
import ControlPanel from './components/ControlPanel.vue';
import LineChart from './components/LineChart.vue';
import AutoSize from './directives/AutoSize';

export default {
  data: function() {
    return {
      chartConfig: {
        chartTitle: 'Exmaple Chart',
        axisTitleX: 'Axis X',
        axisTitleY: 'Axis Y',
        scaleY: 'Linear'
      },
      lines: [
        {
          id: 0,
          values: [1, 71, 78, 25, 36, 72, 80, 100, 110, 120],
          color: 'steelblue'
        },
        {
          id: 1,
          values: [7, 21, 58, 65, 86, 92, 80, 70, 65],
          color: 'blue'
        },
        {
          id: 2,
          values: [5, 41, 68, 55, 76, 32, 60, 140, 100],
          color: 'green'
        }
      ]
    }
  },
  methods: {
    onChangeScale(newScale) {
      this.chartConfig.scaleY = newScale;
    },
    onResetZoom() {
      this.$refs.lineChart.resetDomain();
    },
    onSaveImage() {
      this.$refs.lineChart.saveToImage(1, (dataBlob, fileSize) => saveAs(dataBlob, "Line Chart.png"));
    }
  },
  components: {
    'control-panel': ControlPanel,
    'line-chart': LineChart
  },
  directives: {
    'autosize': AutoSize
  }
}
</script>
