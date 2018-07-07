import React from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({})

const NotFound = ({ classes }) => (
  <div>
    <h1>404 Page Not Found</h1>
  </div>
)

export default withStyles(styles)(NotFound)
