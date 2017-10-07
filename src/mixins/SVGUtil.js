import SaveSvgAsPng from 'save-svg-as-png';

export default {
  methods: {
    downloadSVG(fileName) {
      SaveSvgAsPng.saveSvg(this.$refs.svgRoot, fileName);
    },
    downloadPNG(fileName, scale) {
     SaveSvgAsPng.saveSvgAsPng(this.$refs.svgRoot, fileName, {scale: scale});
    }
  }
}