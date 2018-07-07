import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { graphql, compose } from 'react-apollo'
import { USER_BY_ID_QUERY } from '../apollo/queries/userById'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Avatar from '@material-ui/core/Avatar'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import SendIcon from '@material-ui/icons/Send'
import Loading from '../components/Loading'

const perks = [
  'Comment on blog posts',
  'Receive emails when new posts are published',
  'Free access to bonus tutorial videos',
  'Contact me directly with questions'
]

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5vh'
  },
  image: {
    height: '10%',
    width: '10%',
    marginRight: '2vw'
  },
  greeting: {
    display: 'flex',
    alignItems: 'center'
  },
  infoContainer: {
    marginTop: '5vh'
  },
  expansionContainer: {
    marginTop: '5vh'
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'column'
  },
  profileContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2.5vh'
  },
  profileSave: {
    marginRight: '1vw'
  },
  avatar: {
    height: 50,
    width: 50
  }
})

class UserLanding extends Component {
  state = {
    expanded: 'perks',
    username: '',
    usernameEdit: false,
    email: '',
    emailEdit: false
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data.loading && !this.props.data.loading) {
      this.props.handleLogin(this.props.data.userById)
      localStorage.setItem('TOKEN', this.props.data.userById.jwt)
    }
  }

  handleExpansion = panel => (event, expanded) =>
    this.setState({ expanded: expanded ? panel : false })

  handleChange = e => this.setState({ [e.target.name]: e.target.value })

  toggleUsernameEdit = () =>
    this.setState({ usernameEdit: !this.state.usernameEdit })

  toggleEmailEdit = () => this.setState({ emailEdit: !this.state.emailEdit })

  toggleAvatarEdit = () => {}

  render() {
    const {
      data: { loading, userById },
      classes
    } = this.props
    const { expanded, username, usernameEdit, email, emailEdit } = this.state
    if (loading) return <Loading />
    return (
      <div className={classes.root}>
        <div className={classes.greeting}>
          <img
            src="https://s3-us-west-1.amazonaws.com/simple-blogger-react/avatar.png"
            alt="mark my words"
            className={classes.image}
          />
          <Typography variant="headline">
            Hey {userById.username}. Welcome to my blogosphere.
          </Typography>
        </div>
        <div className={classes.infoContainer}>
          <Typography variant="body2">
            Now that you have created a user account, you get some perks.
          </Typography>
        </div>
        <div className={classes.expansionContainer}>
          <ExpansionPanel
            expanded={expanded === 'perks'}
            onChange={this.handleExpansion('perks')}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="title">Perks</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <List>
                {perks.map((p, i) => (
                  <ListItem key={i}>
                    <ListItemIcon>
                      <SendIcon />
                    </ListItemIcon>
                    <ListItemText primary={p} />
                  </ListItem>
                ))}
              </List>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            expanded={expanded === 'profile'}
            onChange={this.handleExpansion('profile')}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="title">Profile</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails classes={{ root: classes.profileDetails }}>
              {usernameEdit ? (
                <div className={classes.profileContainer}>
                  <TextField
                    type="text"
                    name="username"
                    value={username}
                    onChange={this.handleChange}
                    placeholder="Enter new username"
                  />
                  <div>
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.profileSave}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={this.toggleUsernameEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={classes.profileContainer}>
                  <Typography variant="body2">Username</Typography>
                  <Typography variant="body2">{userById.username}</Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={this.toggleUsernameEdit}
                  >
                    Change
                  </Button>
                </div>
              )}
              {emailEdit ? (
                <div className={classes.profileContainer}>
                  <TextField
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.handleChange}
                    placeholder="Enter new email"
                  />
                  <div>
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.profileSave}
                    >
                      Save
                    </Button>
                    <Button variant="outlined" onClick={this.toggleEmailEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={classes.profileContainer}>
                  <Typography variant="body2">Email</Typography>
                  <Typography variant="body2">{userById.email}</Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={this.toggleEmailEdit}
                  >
                    Change
                  </Button>
                </div>
              )}
              <div className={classes.profileContainer}>
                <Typography variant="body2">Profile Pic</Typography>
                <Avatar
                  src={userById.avatar}
                  alt="profile"
                  className={classes.avatar}
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={this.toggleAvatarEdit}
                >
                  Change
                </Button>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </div>
    )
  }
}

export default compose(
  withStyles(styles),
  graphql(USER_BY_ID_QUERY, {
    options: props => ({ variables: { userId: props.match.params.userId } })
  })
)(UserLanding)
