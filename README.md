# vue-d3-example

An example for using Vue and D3 to create a non-trivial reactive line chart. The line chart in the example supports the following features

- Display multiple line series in different color
- Display chart title and axis title
- Display multiple reference lines in different color
- Hover line to highlight it and see the tooltip
- Interactive zoom and pan with mouse
- Select lines using a rubberband box with multi-select support
- Switch between linear and log scale for Y axis
- Responsive to the resizing of its parent element
- Save to SVG or PNG file with configurable scale rate

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Design Notes

This is a simple app created based on Vue's webpack-simple tamplate. Bootstrap 4 is used for simple styling.

### Chart Components

The line chart consists of three key components:

- *LineChart*: the chart component used by client codes
- *ChartAxis*: used by *LineChart* component internally to display X and Y axis
- *DataLine*: used by *LineChart* component internally to display a single data serie

The following components supports the interaction with the chart or save it as image:

- *GlassPane*: a transparent div overlaid on top of an element (*LineChart* in this example) and captures the mouse events
- *SelectionBox*: a semi-transparent div overlaid on *GlassPane* to indicate the selection area
- *ResizeDetector*: a directive to detect size change of element and call a method (to resize chart in this example)
- *SVGUtil*: a mixin to export SVG root to PNG or SVG file

### Control Panel Component

The control panel component is to demonstrate the line chart features and is not part of the line chart.  

