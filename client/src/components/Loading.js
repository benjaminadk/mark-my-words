import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({})

const Loading = () => <CircularProgress size={80} />

export default withStyles(styles)(Loading)
