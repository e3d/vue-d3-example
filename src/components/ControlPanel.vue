<template>
  <form>
    <fieldset class="form-group">
      <label for="chartTitle">Chart Title</label>
      <input type="text" class="form-control" id="chartTitle" v-model="chartTitle">
    </fieldset>
    <fieldset class="form-group">
      <label for="axisTitleX">X Axis Title</label>
      <input type="text" class="form-control" id="axisTitleX" v-model="axisTitleX">
    </fieldset>
    <fieldset class="form-group">
      <label for="axisTitleY">Y Axis Title</label>
      <input type="text" class="form-control" id="axisTitleY" v-model="axisTitleY">
    </fieldset>
    <fieldset class="form-group">
      <legend class="col-form-legend">Y Axis Scale</legend>
      <label class="form-check-label" style="padding-right:10px;">
        <input class="form-check-input" type="radio" v-model="yScale" value="Linear"> Linear
      </label>
      <label class="form-check-label">
        <input class="form-check-input" type="radio" v-model="yScale" value="Log"> Logarithm
      </label>
      </div>
    </fieldset>
    <hr>
    <button class="btn btn-default" @click="$emit('resetZoom')">
      Reset Zoom
    </button>
    <button class="btn btn-default" @click="$emit('saveImage')">
      Save Image
    </button>
  </form>
</template>

<script>
export default {
  props: {
    'initConfig': {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartTitle: this.initConfig.chartTitle,
      axisTitleX: this.initConfig.axisTitleX,
      axisTitleY: this.initConfig.axisTitleY,
      yScale: 'Linear'
    }
  },
  watch: {
    yScale() {
      this.$emit('changeScale', this.yScale);
    }
  }
}
</script>
