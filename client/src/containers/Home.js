import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center'
  },
  image: {
    height: '75%',
    width: '75%'
  }
})

class Home extends Component {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <img
          src="https://s3-us-west-1.amazonaws.com/simple-blogger-react/mark-my-words.png"
          alt="mark my words"
          className={classes.image}
        />
      </div>
    )
  }
}

export default withStyles(styles)(Home)
