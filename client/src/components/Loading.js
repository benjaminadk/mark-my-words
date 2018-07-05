import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const Loading = ({ classes }) => (
  <div className={classes.container}>
    <CircularProgress size={80} />
  </div>
)

export default withStyles(styles)(Loading)
