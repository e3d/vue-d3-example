import ResizeObserver from 'resize-observer-polyfill';

export default {
  inserted(el, binding, vnode) {
    const component = vnode.componentInstance;
    // requires component has width and height data property
    if (component.width && component.height) {
      const resizeObserver = new ResizeObserver((entries, observer) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          component.width = width;
          component.height = height;
          break; // only expect one node
        }
      });

      resizeObserver.observe(el.parentNode);
      // attach it to vnode to disconnect later
      vnode._resizeObserver = resizeObserver;
    }
  },
  unbind(el, binding, vnode) {
    if (vnode._resizeObserver) {
      vnode._resizeObserver.disconnect();
    }
  }
}