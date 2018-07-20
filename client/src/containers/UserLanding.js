import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { graphql, compose } from 'react-apollo'
import { USER_BY_ID_QUERY } from '../apollo/queries/userById'
import { EDIT_USERNAME_MUTATION } from '../apollo/mutations/editUsername'
import { EDIT_EMAIL_MUTATION } from '../apollo/mutations/editEmail'
import { EDIT_AVATAR_MUTATION } from '../apollo/mutations/editAvatar'
import { S3_SIGN_MUTATION } from '../apollo/mutations/s3Sign'
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
import CircularProgress from '@material-ui/core/CircularProgress'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import SendIcon from '@material-ui/icons/Send'
import Snack from '../components/Snack'
import Loading from '../components/Loading'
import Dropzone from 'react-dropzone'
import axios from 'axios'

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
    marginTop: '5vh',
    marginBottom: '5vh'
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
  },
  avatarEdit: {
    width: '55%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  dropzone: {
    width: 50,
    height: 50,
    border: `1px dashed ${theme.palette.text.secondary}`,
    borderRadius: '10px',
    cursor: 'pointer',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  buttons: {
    display: 'flex'
  },
  wrapper: {
    position: 'relative',
    marginRight: '1vw'
  },
  progressButton: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
})

class UserLanding extends Component {
  state = {
    expanded: 'perks',
    username: '',
    usernameEdit: false,
    email: '',
    emailEdit: false,
    file: null,
    progress: 0,
    avatarEdit: false,
    snack: false,
    snackVariant: '',
    snackMessage: ''
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

  handleEditUsername = async () => {
    const { username } = this.state
    let response = await this.props.editUsername({
      variables: { username },
      refetchQueries: [
        {
          query: USER_BY_ID_QUERY,
          variables: { userId: this.props.match.params.userId }
        }
      ]
    })
    const { success, message } = response.data.editUsername
    await this.setState({
      snack: true,
      snackVariant: success ? 'success' : 'error',
      snackMessage: message,
      username: '',
      usernameEdit: false
    })
  }

  handleEditEmail = async () => {
    const { email } = this.state
    let response = await this.props.editEmail({
      variables: { email },
      refetchQueries: [
        {
          query: USER_BY_ID_QUERY,
          variables: { userId: this.props.match.params.userId }
        }
      ]
    })
    const { success, message } = response.data.editEmail
    await this.setState({
      snack: true,
      snackVariant: success ? 'success' : 'error',
      snackMessage: message,
      email: '',
      emailEdit: false
    })
  }

  handleEditAvatar = async () => {
    const { file } = this.state
    let response = await this.props.s3Sign({
      variables: { filename: file.name, filetype: file.type }
    })
    const { requestUrl, imageUrl } = response.data.s3Sign
    const options = {
      headers: { 'Content-Type': file.type },
      onUploadProgress: progressEvent => {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        this.setState({ progress: percentCompleted })
      }
    }
    await axios.put(requestUrl, file, options)
    let response2 = await this.props.editAvatar({
      variables: { avatar: imageUrl },
      refetchQueries: [
        {
          query: USER_BY_ID_QUERY,
          variables: { userId: this.props.match.params.userId }
        }
      ]
    })
    const { success, message } = response2.data.editAvatar
    await this.setState({
      snack: true,
      snackVariant: success ? 'success' : 'error',
      snackMessage: message,
      avatarEdit: false,
      file: null,
      progress: 0
    })
  }

  toggleEmailEdit = () => this.setState({ emailEdit: !this.state.emailEdit })

  enterAvatarEdit = () => this.setState({ avatarEdit: true })

  cancelAvatarEdit = () =>
    this.setState({ avatarEdit: false, file: null, progress: 0 })

  handleDrop = files => this.setState({ file: files[0], progress: 0 })

  handleSnackClose = () => this.setState({ snack: false })

  render() {
    const {
      data: { loading, userById },
      classes
    } = this.props
    const {
      expanded,
      username,
      usernameEdit,
      email,
      emailEdit,
      file,
      progress,
      avatarEdit
    } = this.state
    if (loading) {
      return <Loading />
    }
    return [
      <div key="main" className={classes.root}>
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
                      onClick={this.handleEditUsername}
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
                      onClick={this.handleEditEmail}
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
              {avatarEdit ? (
                <div className={classes.profileContainer}>
                  <div className={classes.avatarEdit}>
                    <Typography variant="body2">
                      Click || Drag & Drop
                    </Typography>
                    <Dropzone
                      accept="image/*"
                      multiple={false}
                      className={classes.dropzone}
                      onDrop={this.handleDrop}
                      style={{
                        backgroundImage: file && `url(${file.preview})`
                      }}
                    />
                  </div>
                  <div className={classes.buttons}>
                    <div className={classes.wrapper}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={this.handleEditAvatar}
                        disabled={!file}
                      >
                        Save
                      </Button>
                      {progress > 0 && (
                        <CircularProgress
                          size={24}
                          variant="determinate"
                          value={progress}
                          className={classes.progressButton}
                        />
                      )}
                    </div>
                    <Button variant="outlined" onClick={this.cancelAvatarEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
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
                    onClick={this.enterAvatarEdit}
                  >
                    Change
                  </Button>
                </div>
              )}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </div>,
      <Snack
        key="snack"
        snack={this.state.snack}
        snackVariant={this.state.snackVariant}
        snackMessage={this.state.snackMessage}
        handleClose={this.handleSnackClose}
      />
    ]
  }
}

export default compose(
  withStyles(styles),
  graphql(USER_BY_ID_QUERY, {
    options: props => ({ variables: { userId: props.match.params.userId } })
  }),
  graphql(EDIT_USERNAME_MUTATION, { name: 'editUsername' }),
  graphql(EDIT_EMAIL_MUTATION, { name: 'editEmail' }),
  graphql(EDIT_AVATAR_MUTATION, { name: 'editAvatar' }),
  graphql(S3_SIGN_MUTATION, { name: 's3Sign' })
)(UserLanding)
