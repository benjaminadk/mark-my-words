import React, { Component } from 'react'
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  VerticalBarSeries,
  Crosshair
} from 'react-vis'

const colorPalette = ['#c1272d', '#ffce00', '#3F51B5']

export default class ViewsPerPost extends Component {
  state = {
    crosshairValues: []
  }

  handleMouseOver = (datapoint, event) =>
    this.setState({ crosshairValues: [datapoint] })

  handleMouseOut = () => this.setState({ crosshairValues: [] })

  formatCrosshairTitle = values => ({ title: 'post', value: values[0].x })

  formatCrosshairItems = values => [{ title: 'views', value: values[0].y }]

  render() {
    const { viewsPerPost } = this.props
    return (
      <XYPlot
        margin={{ left: 100, bottom: 100 }}
        height={400}
        width={600}
        yDomain={[0, 20]}
        xType="ordinal"
        colorType="category"
        colorRange={colorPalette}
      >
        <HorizontalGridLines />
        <VerticalGridLines />
        <XAxis tickTotal={viewsPerPost.length} tickLabelAngle={-55} />
        <YAxis title="Views" />
        <VerticalBarSeries
          data={viewsPerPost}
          onValueMouseOver={this.handleMouseOver}
          onValueMouseOut={this.handleMouseOut}
        />
        <Crosshair
          values={this.state.crosshairValues}
          itemsFormat={this.formatCrosshairItems}
          titleFormat={this.formatCrosshairTitle}
          style={{ line: { display: 'none' } }}
        />
      </XYPlot>
    )
  }
}
