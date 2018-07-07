import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const Loading = ({ classes }) => (
  <div className={classes.container}>
    <CircularProgress size={80} thickness={2.0} color="secondary" />
    <Typography variant="body2">Loading...</Typography>
  </div>
)

export default withStyles(styles)(Loading)
