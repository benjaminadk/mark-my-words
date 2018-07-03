import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core/styles'
import MainNav from '../components/MainNav/MainNav'
import NewPost from '../containers/NewPost'
import AllPosts from '../containers/AllPosts'
import Post from '../containers/Post'
import Photos from '../containers/Photos'
import theme from '../styles/theme'

const Home = () => <h1>BLOG</h1>

class Root extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <MainNav>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/new-post" component={NewPost} />
              <Route path="/all-posts" component={AllPosts} />
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
