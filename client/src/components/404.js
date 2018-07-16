import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  title: {
    marginTop: '10vh'
  },
  login: {
    marginTop: '5vh',
    marginLeft: '20vw',
    marginRight: '20vw'
  }
})

const NotFound = ({ classes }) => (
  <div>
    <Typography variant="display2" align="center" className={classes.title}>
      404 Page Not Found
    </Typography>
    <Typography variant="body2" align="justify" className={classes.login}>
      If you tried to log in and ended up here please clear your browser cache
      for this page and try logging in again. On Chrome, open the DevTool with
      Ctrl + Shift + I. Go to the Application tab, then down to the third option
      Clear Storage. At the bottom of the main section click the Clear site data
      button. Now attempt to login again and everything should work fine.
    </Typography>
  </div>
)

export default withStyles(styles)(NotFound)
