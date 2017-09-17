import elementResizeDetectorMaker from 'element-resize-detector';

const erd = elementResizeDetectorMaker({
  strategy: "scroll" //<- For ultra performance.
});

export default {
  bind(el, binding, vnode) {
    erd.listenTo(el, function(element) {
      // var width = element.offsetWidth;
      // var height = element.offsetHeight;
      // console.log("Size: " + width + "x" + height);
      binding.value(element);
    });
  },
  unbind(el, binding, vnode) {
    erd.uninstall(el);
  }
}