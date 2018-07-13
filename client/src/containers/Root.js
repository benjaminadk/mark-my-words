import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { PropsRoute, Auth, Admin } from '../utils/routing'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { graphql, compose } from 'react-apollo'
import { AUTOLOGIN_MUTATION } from '../apollo/mutations/autoLogin'
import MainNav from '../components/MainNav/MainNav'
import Home from './Home'
import LatestPost from './LatestPost'
import NewPost from './NewPost'
import AllPostsContainer from './AllPostsContainer'
import Post from './Post'
import Photos from './Photos'
import Analytics from './Analytics'
import UserLanding from './UserLanding'
import NotFound from '../components/404'
import Snack from '../components/Snack'
import theme from '../styles/theme'

class Root extends Component {
  state = {
    blog: null,
    user: null,
    admin: false,
    loggedIn: false,
    snack: false,
    snackMessage: '',
    snackVariant: ''
  }

  async componentWillMount() {
    const token = localStorage.getItem('TOKEN')
    if (token) {
      let response = await this.props.autoLogin()
      const { success, message, user, admin } = response.data.autoLogin
      if (admin) {
        Admin.enterAdminMode()
      }
      if (success) {
        Auth.authenticate()
      }
      this.setState({
        user,
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

  render() {
    return [
      <MuiThemeProvider key="main" theme={theme}>
        <BrowserRouter>
          <MainNav
            userId={this.state.user ? this.state.user.id : null}
            isAuthenticated={this.state.loggedIn}
            isAdmin={this.state.admin && Admin.isAdmin}
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
                render={() => (
                  <NewPost blog={this.state.blog} editMode={true} />
                )}
              />
              <PropsRoute
                path="/all-posts"
                component={AllPostsContainer}
                handleBlog={this.handleBlog}
              />
              <Route path="/post/:postId" component={Post} />
              <Route path="/analytics" component={Analytics} />
              <Route path="/photos" component={Photos} />
              <PropsRoute
                path="/user/:userId"
                component={UserLanding}
                handleLogin={this.handleLogin}
              />
              <Route component={NotFound} />
            </Switch>
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

export default compose(graphql(AUTOLOGIN_MUTATION, { name: 'autoLogin' }))(Root)
