import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
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

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  title: {
    marginLeft: '5vw'
  }
})

class ViewsPerPost extends Component {
  state = {
    crosshairValues: []
  }

  handleMouseOver = (datapoint, event) =>
    this.setState({ crosshairValues: [datapoint] })

  handleMouseOut = () => this.setState({ crosshairValues: [] })

  formatCrosshairTitle = values => ({ title: 'post', value: values[0].x })

  formatCrosshairItems = values => [{ title: 'views', value: values[0].y }]

  render() {
    const { viewsPerPost, maxViews, classes } = this.props
    return (
      <div className={classes.root}>
        <Typography variant="display1" className={classes.title}>
          Views Per Post
        </Typography>
        <XYPlot
          margin={{ left: 100, bottom: 120 }}
          height={400}
          width={600}
          yDomain={[0, maxViews * 1.25]}
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
      </div>
    )
  }
}

export default withStyles(styles)(ViewsPerPost)
