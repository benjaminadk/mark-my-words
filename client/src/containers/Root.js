import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { PropsRoute } from '../utils/routing'
import { MuiThemeProvider } from '@material-ui/core/styles'
import MainNav from '../components/MainNav/MainNav'
import NewPost from './NewPost'
import AllPostsContainer from './AllPostsContainer'
import Post from './Post'
import Photos from './Photos'
import theme from '../styles/theme'

const Home = () => <h1>Home</h1>

class Root extends Component {
  state = {
    blog: null
  }

  handleBlog = blog => this.setState({ blog })

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <MainNav>
            <Switch>
              <Route exact path="/" component={Home} />
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
              <Route path="/photos" component={Photos} />
            </Switch>
          </MainNav>
        </BrowserRouter>
      </MuiThemeProvider>
    )
  }
}

export default Root
