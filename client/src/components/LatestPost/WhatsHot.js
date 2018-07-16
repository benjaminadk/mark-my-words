import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import FireIcon from '@material-ui/icons/Whatshot'

const styles = theme => ({})

class WhatsHot extends Component {
  render() {
    return (
      <div>
        <FireIcon />
      </div>
    )
  }
}

export default withStyles(styles)(WhatsHot)
