import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  MarkSeries,
  Crosshair
} from 'react-vis'

const colorPalette = ['#ffce00', '#ffa100', '#c1272d']

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '10vh'
  },
  title: {
    marginLeft: '5vw'
  }
})

class FlamesPerPost extends Component {
  state = {
    crosshairValues: []
  }

  handleMouseOver = (datapoint, event) =>
    this.setState({ crosshairValues: [datapoint] })

  handleMouseOut = () => this.setState({ crosshairValues: [] })

  formatCrosshairTitle = values => ({ title: 'post', value: values[0].x })

  formatCrosshairItems = values => [{ title: 'fire', value: values[0].y }]

  render() {
    const { firePerPost, maxFire, classes } = this.props
    return (
      <div className={classes.root}>
        <Typography variant="display1" className={classes.title}>
          Fire Per Post
        </Typography>
        <XYPlot
          margin={{ left: 100, bottom: 120 }}
          height={400}
          width={600}
          yDomain={[0, maxFire * 1.25]}
          xType="ordinal"
          colorType="category"
          colorRange={colorPalette}
        >
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis tickTotal={firePerPost.length} tickLabelAngle={-55} />
          <YAxis title="Fire" />
          <MarkSeries
            data={firePerPost}
            sizeRange={[5, 50]}
            opacity="0.8"
            strokeWidth={2}
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

export default withStyles(styles)(FlamesPerPost)
