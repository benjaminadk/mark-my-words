import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import FireIcon from '@material-ui/icons/Whatshot'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20vh'
  },
  fire: {
    height: '40px',
    width: '40px',
    borderRadius: '50%',
    backgroundColor: '#ffce00',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainer: {
    height: '60px',
    width: '60px',
    marginTop: '2vh',
    marginBottom: '1vh',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffce00'
  },
  icon: {
    fontSize: '40px',
    color: theme.palette.secondary.main
  }
})

class WhatsHot extends Component {
  render() {
    const {
      classes,
      fire,
      hotCount,
      hotCounter,
      handleHCMouseDown,
      handleHCMouseUp
    } = this.props
    return (
      <div className={classes.root}>
        <div className={classes.fire} style={{ opacity: hotCounter ? 1 : 0 }}>
          <Typography variant="body2">+{hotCount}</Typography>
        </div>

        <div
          className={classes.iconContainer}
          onMouseDown={handleHCMouseDown}
          onMouseUp={handleHCMouseUp}
        >
          <FireIcon className={classes.icon} />
        </div>
        <Typography variant="body2">{fire}</Typography>
      </div>
    )
  }
}

export default withStyles(styles)(WhatsHot)
