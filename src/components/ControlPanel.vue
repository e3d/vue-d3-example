<template>
  <form>
    <fieldset class="form-group">
      <label for="chartTitle">Chart Title</label>
      <input type="text" class="form-control" id="chartTitle" v-model="title">
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
    <button class="btn btn-default" @click.prevent="$emit('resetZoom')">
      Reset Zoom
    </button>
    <button class="btn btn-default" @click.prevent="$emit('saveImage')">
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
      title: this.initConfig.title,
      axisTitleX: this.initConfig.axisX.title,
      axisTitleY: this.initConfig.axisY.title,
      yScale: this.initConfig.axisY.scale
    }
  },
  watch: {
    yScale() {
      this.$emit('changeScale', this.yScale);
    },
    title() {
      this.$emit('changeTitle', this.title);
    },
    axisTitleX() {
      this.$emit('changeAxisTitleX', this.axisTitleX);
    },
    axisTitleY() {
      this.$emit('changeAxisTitleY', this.axisTitleY);
    }
  }
}
</script>
