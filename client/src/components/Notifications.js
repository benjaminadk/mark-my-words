import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import Popper from '@material-ui/core/Popper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Avatar from '@material-ui/core/Avatar'
import Zoom from '@material-ui/core/Zoom'
import CloseIcon from '@material-ui/icons/Close'
import { howLongAgo } from '../utils/howLongAgo'

const styles = theme => ({
  root: {
    zIndex: 2,
    minHeight: '10vh',
    maxHeight: '60vh',
    width: '30vw',
    border: `1px solid ${theme.palette.divider}`,
    marginTop: '8vh',
    backgroundColor: 'white'
  },
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    backgroundColor: '#ffce00',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titleText: {
    padding: '.5vw'
  },
  iconButton: {
    color: '#000000',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  content: {
    display: 'flex',
    flexDirection: 'column'
  },
  notification: {
    display: 'flex',
    alignItems: 'center',
    padding: '.25vw',
    paddingTop: '.5vw',
    cursor: 'pointer',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: theme.palette.divider
    }
  },
  text: {
    marginLeft: '.5vw'
  }
})

const Notifications = ({
  classes,
  notifications,
  popper,
  anchorEl,
  handleClosePopper,
  handleMarkAsSeen
}) => (
  <Popper
    open={popper}
    anchorEl={anchorEl}
    placement="left-end"
    className={classes.root}
    transition
  >
    {({ TransitionProps }) => (
      <Zoom {...TransitionProps}>
        <div className={classes.container}>
          <div className={classes.title}>
            <Typography variant="body2" className={classes.titleText}>
              Notifications
            </Typography>
            <IconButton
              classes={{ root: classes.iconButton }}
              onClick={handleClosePopper}
              disableRipple
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div className={classes.content}>
            {notifications &&
              notifications
                .map((n, i) => {
                  return (
                    <Link
                      to={n.link}
                      key={n.id}
                      onClick={() => handleMarkAsSeen(n.id)}
                      className={classes.notification}
                    >
                      <Avatar src={n.avatar} alt="notification icon" />
                      <div className={classes.text}>
                        <Typography variant="caption">{`${
                          n.type
                        }: `}</Typography>
                        <Typography variant="body1">{n.text}</Typography>
                        <Typography variant="caption">
                          {howLongAgo(n.createdAt)}
                        </Typography>
                      </div>
                    </Link>
                  )
                })
                .reverse()}
          </div>
        </div>
      </Zoom>
    )}
  </Popper>
)

export default withStyles(styles)(Notifications)
