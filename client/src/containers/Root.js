import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { PropsRoute, Auth, Admin } from '../utils/routing'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { graphql, compose } from 'react-apollo'
import { AUTOLOGIN_MUTATION } from '../apollo/mutations/autoLogin'
import { MARK_AS_SEEN_MUTATION } from '../apollo/mutations/markAsSeen'
import MainNav from '../components/MainNav/MainNav'
import Home from './Home'
import LatestPost from './LatestPost'
import NewPost from './NewPost'
import AllPostsContainer from './AllPostsContainer'
import AnyPost from './AnyPost'
import Photos from './Photos'
import Analytics from './Analytics'
import About from './About'
import UserLanding from './UserLanding'
import NotFound from '../components/404'
import Snack from '../components/Snack'
import Notifications from '../components/Notifications'
import theme from '../styles/theme'

class Root extends Component {
  state = {
    blog: null,
    user: null,
    unseen: 0,
    admin: false,
    loggedIn: false,
    popper: false,
    snack: false,
    snackMessage: '',
    snackVariant: ''
  }

  async componentWillMount() {
    const token = localStorage.getItem('TOKEN')
    let unseen = 0
    if (token) {
      let response = await this.props.autoLogin()
      const { success, message, user, admin } = response.data.autoLogin
      if (admin) {
        Admin.enterAdminMode()
      }
      if (success) {
        Auth.authenticate()
        let { notifications } = user
        let seenIds = user.seen
        let allIds = []
        notifications.forEach(n => {
          allIds.push(n.id)
        })
        allIds.forEach(id => {
          if (seenIds.indexOf(id) === -1) {
            unseen += 1
          }
        })
      }
      this.setState({
        user,
        unseen,
        loggedIn: success,
        admin,
        snack: true,
        snackMessage: message,
        snackVariant: success ? 'success' : 'error'
      })
    }
  }

  handleSnackClose = () => this.setState({ snack: false })

  handleBlog = blog => this.setState({ blog })

  handleLogin = user => {
    Auth.authenticate()
    this.setState({ loggedIn: true, user })
  }

  handleLogout = () => {
    Auth.logout()
    Admin.exitAdminMode()
    this.setState({ loggedIn: false, user: null, admin: false })
    localStorage.removeItem('TOKEN')
  }

  handleOpenPopper = e => this.setState({ popper: true, anchorEl: e.currentTarget })

  handleClosePopper = () => this.setState({ popper: false })

  handleMarkAsSeen = async notificationId => {
    let seenIds = this.state.user.seen
    if (seenIds.indexOf(notificationId === -1)) {
      let response = await this.props.markAsSeen({
        variables: { notificationId },
        refetchQueries: [{ query: AUTOLOGIN_MUTATION }]
      })
      const { success } = response.data.markAsSeen
      if (success) {
        this.setState({ unseen: this.state.unseen - 1 })
      }
    }
  }

  render() {
    return [
      <MuiThemeProvider key="main" theme={theme}>
        <BrowserRouter>
          <MainNav
            userId={this.state.user ? this.state.user.id : null}
            isAuthenticated={this.state.loggedIn}
            isAdmin={this.state.admin && Admin.isAdmin}
            unseen={this.state.unseen}
            handleOpenPopper={this.handleOpenPopper}
            handleLogout={this.handleLogout}
          >
            <Switch>
              <Route exact path="/" component={Home} />
              <PropsRoute
                path="/latest-post"
                component={LatestPost}
                isAuthenticated={this.state.loggedIn}
                user={this.state.user || null}
              />
              <Route path="/new-post" component={NewPost} />
              <Route
                path="/edit"
                render={() => <NewPost blog={this.state.blog} editMode={true} />}
              />
              <PropsRoute
                path="/all-posts"
                component={AllPostsContainer}
                isAdmin={this.state.admin && Admin.isAdmin}
                handleBlog={this.handleBlog}
              />
              <PropsRoute
                path="/post/:postId"
                component={AnyPost}
                isAuthenticated={this.state.loggedIn}
                user={this.state.user || null}
              />
              <Route path="/analytics" component={Analytics} />
              <Route path="/photos" component={Photos} />
              <Route path="/about" component={About} />
              <PropsRoute
                path="/user/:userId"
                component={UserLanding}
                handleLogin={this.handleLogin}
              />
              <Route component={NotFound} />
            </Switch>
            {/* <Notifications
              notifications={
                this.state.user ? this.state.user.notifications : null
              }
              popper={this.state.popper}
              anchorEl={this.state.anchorEl}
              handleClosePopper={this.handleClosePopper}
              handleMarkAsSeen={this.handleMarkAsSeen}
            /> */}
          </MainNav>
        </BrowserRouter>
      </MuiThemeProvider>,
      <Snack
        key="snackbar"
        open={this.state.snack}
        message={this.state.snackMessage}
        variant={this.state.snackVariant}
        handleClose={this.handleSnackClose}
      />
    ]
  }
}

export default compose(
  graphql(AUTOLOGIN_MUTATION, { name: 'autoLogin' }),
  graphql(MARK_AS_SEEN_MUTATION, { name: 'markAsSeen' })
)(Root)
