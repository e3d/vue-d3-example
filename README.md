# vue-d3-example

> An example for using Vue and D3 to create a reactive line chart. The line chart in the example supports the following features

- Display multiple line series in different color
- Display chart title and axis title (TODO)
- Zoom and pan
- Swith between linear and log scale (Y axis)
- Responsive to the resizing of its parent element (TODO)
- Save to PNG file with confiurable resolution
- Select lines using a rubberband box (TODO)

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

The following components supports the interaction with the chart, such as zoom, pan and data selection:

- *GlassPane*: a transparent div overlaid on top of an element (*LineChart* in this example) and captures the mouse events
- *SelectionBox*: a semi-transparent div overlaid on *GlassPane* to indicate the selection area
- *AutoSize*: a directive to automatically update `width` and `height` of the host element when the parent element is resized

### Control Panel Component

The control panel component is to demonstrate the line chart features and is not part of the line chart.  

### Third-party Sources

- *svgToImage*: a function to save SVG with styling to PNG image stream, based on the codes from Nikita [Rokotyan's block](http://bl.ocks.org/Rokotyan/0556f8facbaf344507cdc45dc3622177).
