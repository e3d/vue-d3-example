<template>
  <form>
    <div class="form-group">
      <label for="chartTitle">Chart Title</label>
      <input type="text" class="form-control" id="chartTitle" v-model="title">
    </div>
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="axisTitleX">X Axis Title</label>
        <input type="text" class="form-control" id="axisTitleX" v-model="axisTitleX">
      </div>
      <div class="form-group col-md-6">
        <label for="axisTitleY">Y Axis Title</label>
        <input type="text" class="form-control" id="axisTitleY" v-model="axisTitleY">
      </div>
    </div>
    <hr>
    <div class="form-row">
      <div class="form-group col-md-6">
        <legend class="col-form-legend">Y Axis Scale</legend>
        <label class="form-check-label" style="padding-right:10px;">
          <input class="form-check-input" type="radio" v-model="yScale" value="Linear"> Linear
        </label>
        <label class="form-check-label">
          <input class="form-check-input" type="radio" v-model="yScale" value="Log"> Logarithm
        </label>
      </div>
      <div class="form-group col-md-6">
        <button class="btn btn-default" @click.prevent="$emit('resetZoom')">
          Reset Zoom
        </button>
      </div>
    </div>
    <hr>
    <div class="form-inline">
      <select class="form-control mb-2 mr-sm-2 mb-sm-0" v-model="imageFormat">
        <option value="svg">SVG</option>
        <option value="png">PNG</option>
      </select>
      <select v-if="imageFormat ==='png'" class="form-control mb-2 mr-sm-2 mb-sm-0" v-model="imageScale">
        <option value="1">1x</option>
        <option value="2">2x</option>
        <option value="3">3x</option>
        <option value="4">4x</option>
      </select>
      <button class="btn btn-default" @click.prevent="$emit('saveImage', imageFormat, imageScale)">
        Save As Image
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      title: this.options.title,
      axisTitleX: this.options.axisX.title,
      axisTitleY: this.options.axisY.title,
      yScale: this.options.axisY.scale || 'Linear',
      imageFormat: 'png',
      imageScale: 2
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
